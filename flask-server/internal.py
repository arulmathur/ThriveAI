from torchvision import datasets, models, transforms
import dill as pickle
import os
import cv2
import numpy as np
from matplotlib import pyplot as plt
import torch
from models import DenseNet121
import joblib
import torch.nn as nn
from utililties import *
from torch.utils.data import DataLoader
import torch
from pytorch_grad_cam import *
from pytorch_grad_cam.utils.image import show_cam_on_image, \
    preprocess_image



nrows = 256
ncolumns = 256

image_transforms = transforms.Compose([
        transforms.Lambda(lambda x: x/255),
        transforms.ToPILImage(), 
        transforms.Resize((230, 230)),
        transforms.CenterCrop(size=224),
        transforms.ToTensor(),
        transforms.Normalize([0.45271412, 0.45271412, 0.45271412],
                            [0.33165374, 0.33165374, 0.33165374])
    ])

def preprocess(image_path: str):
    img = None
    if image_path.split(".")[1] == "jpg":
        img = plt.imread(image_path)

    else: 
        img = cv2.imread(image_path)
    out = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    return out

def standardize_img(preprocessed_img):
    # print(data)
    X = []
    if preprocessed_img.ndim>=3:
        X.append(np.moveaxis(cv2.resize(preprocessed_img[:,:,:3], (nrows,ncolumns),interpolation=cv2.INTER_CUBIC), -1, 0))
    else:
        smimg= cv2.cvtColor(preprocessed_img,cv2.COLOR_GRAY2RGB)
        X.append(np.moveaxis(cv2.resize(smimg, (nrows,ncolumns),interpolation=cv2.INTER_CUBIC), -1, 0))

    return np.array(X)

def infer_single(image_path: str):

    preprocessed = preprocess(image_path)
    x = standardize_img(preprocessed)
    dataset = MyDataset_test(x,image_transforms) # x is output of standardize

    return classify(dataset)

def infer_many(img_pths):
    preds = []
    for pth in img_pths:
        preprocessed = preprocess(pth)
        x = standardize_img(preprocessed)
        dataset = MyDataset_test(x,image_transforms) # x is output of standardize
        preds.append(classify(dataset))
    return preds

def classify(dataset):
    num_classes = 2
    model_main = DenseNet121(num_classes,pretrained=True)
    checkpoint0 = torch.load("Model_densenet121_state.pth")
    model_main.load_state_dict(checkpoint0)
    model_main.eval()

    clf = joblib.load('classifier_model.sav')
    model_main.fc = nn.Identity()
    for param in model_main.parameters():
                param.requires_grad_(False)

    dataloader = DataLoader(
    dataset,
    batch_size=16,
    pin_memory=True,worker_init_fn=np.random.seed(7), drop_last=False)

    y_pred2=[]
    for inputs in dataloader:
        outputs = model_main(inputs)
        preds = clf.predict(outputs)
        
        for ii in range(len(preds)):
            if preds[ii] > 0.5:
                y_pred2.append('COVID Positive')
            else:
                y_pred2.append('COVID Negative')

    return y_pred2[0]

def generate_fullgrad(image_path: str, output_path: str):

    num_classes = 2
    model_main = DenseNet121(num_classes,pretrained=True)
    checkpoint0 = torch.load("Model_densenet121_state.pth")
    model_main.load_state_dict(checkpoint0)
    model_main.eval()

    def reshape_transform(tensor):
        return tensor

    layer = [model_main.encoder4]

    cam = FullGrad(model=model_main,
        target_layers=layer,
        reshape_transform=reshape_transform)

    rgb_img = preprocess(image_path)
    rgb_img = np.float32(rgb_img) / 255
    input_tensor = preprocess_image(rgb_img, mean=[0.5, 0.5, 0.5],
                                    std=[0.5, 0.5, 0.5])
    # Otherwise, targets the requested category.
    targets = None
    # You can override the internal batch size for faster computation.
    cam.batch_size = 32

    grayscale_cam = cam(input_tensor=input_tensor,
                        targets=targets)

    grayscale_cam = grayscale_cam[0, :]

    cam_image = show_cam_on_image(rgb_img, grayscale_cam)
    cv2.imwrite(output_path, cam_image)
