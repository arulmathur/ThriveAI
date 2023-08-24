from flask import Flask, request, Response, send_file
import json
from io import BytesIO
import bcrypt
import uuid

# ai stuff

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
    if preprocessed_img.ndim >= 3:
        X.append(np.moveaxis(cv2.resize(
            preprocessed_img[:, :, :3], (nrows, ncolumns), interpolation=cv2.INTER_CUBIC), -1, 0))
    else:
        smimg = cv2.cvtColor(preprocessed_img, cv2.COLOR_GRAY2RGB)
        X.append(np.moveaxis(cv2.resize(smimg, (nrows, ncolumns),
                 interpolation=cv2.INTER_CUBIC), -1, 0))

    return np.array(X)


def infer_single(image_path: str):

    preprocessed = preprocess(image_path)
    x = standardize_img(preprocessed)
    dataset = MyDataset_test(x, image_transforms)  # x is output of standardize

    return classify(dataset)


def infer_many(img_pths):
    preds = []
    for pth in img_pths:
        preprocessed = preprocess(pth)
        x = standardize_img(preprocessed)
        # x is output of standardize
        dataset = MyDataset_test(x, image_transforms)
        preds.append(classify(dataset))
    return preds


def classify(dataset):
    num_classes = 2
    model_main = DenseNet121(num_classes, pretrained=True)
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
        pin_memory=True, worker_init_fn=np.random.seed(7), drop_last=False)

    y_pred2 = []
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
    model_main = DenseNet121(num_classes, pretrained=True)
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


# flask stuff


app = Flask(__name__)


def test_operation(input):
    input["Test_1"] = "TEST_PASSED"
    input["Test_2"] = "TEST_PASSED"
    input["Test_3"] = "TEST_PASSED"
    return input


def verify(token):
    if (isinstance(token, str)):
        token = json.loads(token)
    if not 'user' in token:
        return False
    if not 'pw' in token:
        return False

    user = token['user']
    pw = token['pw']
    id = token['id']
    role = token['role']

    file = open('./database/accounts.json')
    data = json.load(file)

    for acc in data:
        if acc['username'] == user and acc['id'] == id and acc['role'] == role:
            # check if username matches
            if bcrypt.checkpw(pw.encode('utf-8'), acc['salted'].encode('utf-8')):
                # check if password matches

                print("found!")
                return {
                    "role": acc['role'],
                    "user": user,
                    "pw": pw,
                    "id": acc['id']
                }
            else:
                return False
    return False


@app.route("/get_patient", methods=["POST"])
# format: {"token": token of either doctor or patient}}
def send_patient_data():
    print("geetting patient id")

    req = request.get_json()
    print(req)
    token = req['token']
    requested_patient_id = req['id']
    if not verify(token):
        return Response(status=204)

    # must match the patient's
    if token['id'] == requested_patient_id:
        file = open('./database/patients.json')
        data = json.load(file)
        for patient_info in data:
            if patient_info['id'] == requested_patient_id:
                print("returning patient info, " + str(patient_info))
                return patient_info
        return Response(status=204)
    else:
        return Response(status=204)


@app.route("/create_account", methods=["POST"])
# format: {"token": token of doctor, patient data}
# will generate a referral link that patient can use to register
def create_referral():
    req = request.get_json()
    account_data = req['packet']['patient']
    doctor_token = req['packet']['token']
    if not verify(doctor_token):
        return False

    try:
        note = account_data['note']
        age = account_data['info']['age']
        sex = account_data['info']['sex']
        name = account_data['info']['name']
    except:
        return False

    salt = bcrypt.gensalt()


@app.route("/database/<patient_id>/<filename>", methods=["GET"])
def sendit(patient_id, filename):
    # print(request.get_json())
    # patient_id = request.get_json()['packet']['id']

    file = send_file('./database/' + patient_id + "/" +
                     filename, mimetype='image/png')

    return file


@app.route("/login", methods=["POST"])
def authen():
    print("tryna do it")
    print(request)
    got = request.get_json()['user']
    print(got)
    user = got['username']
    pw = got['password']

    # try to locate user
    file = open('./database/accounts.json')
    data = json.load(file)
    for acc in data:
        if acc['username'] == user:
            # check if pw matches
            if bcrypt.checkpw(pw.encode('utf-8'), acc['salted'].encode('utf-8')):
                # gaming
                print("found!")
                return {
                    "success": True,
                    "role": acc['role'],
                    "user": user,
                    "pw": pw,
                    "id": acc['id']
                }
            else:
                return {
                    "success": False,
                    "message": "Incorrect password."
                }
    return {
        "success": False,
        "message": "Could not find account name."
    }


@app.route("/get_patients", methods=["POST"])
def get_all_patients():
    req = request.get_json()
    print("patient get all request: " + str(req))
    doctor_token = req
    if not verify(doctor_token) and doctor_token['role'] == "doctor":
        return False

    doctor_id = doctor_token['id']

    file = open('./database/patients.json')
    data = json.load(file)

    patient_list = []

    for patient_info in data:
        if patient_info['doctor'] == doctor_id:
            patient_list.append(patient_info)

    print(patient_list)
    return patient_list


if __name__ == "__main__":
    app.run(port=5001, debug=True)
