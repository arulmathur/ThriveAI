import os
#os.environ['CUDA_VISIBLE_DEVICES'] = '0,1,2,3'
import pickle
from datetime import datetime
import cv2
import math
import numpy as np
import matplotlib.pyplot as plt
import os
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import train_test_split
import seaborn as sns
import PIL
import torch
import torch.utils.data as data
from torch.utils.data import Dataset, DataLoader, Subset
from torch.utils.tensorboard import SummaryWriter
from torch.optim import lr_scheduler
import torch.nn as nn
import torch.optim as optim
from torch.nn import functional as F
from torch.nn import init
from torch.autograd import Variable
import torchvision
from torchvision import datasets, models, transforms
from torch import nn


import time, copy, argparse
import multiprocessing
from matplotlib import pyplot as plt
from sklearn.metrics import f1_score, accuracy_score
from torch import FloatTensor
from sklearn.model_selection import KFold
from sklearn.model_selection import StratifiedKFold
from sklearn.model_selection import train_test_split



from sklearn.model_selection import cross_val_score
from sklearn.metrics import accuracy_score
from sklearn.metrics import f1_score
from sklearn.ensemble import ExtraTreesClassifier
from sklearn import svm
import random


import functools
import joblib

from models import ResidualAttentionModel, DenseNet121, MyEnsemble
from utililties import *          




def estimate(X_train,y_train):
    i = 0
    ii = 0
    nrows=256
    ncolumns=256
    channels=1
    ntrain=0.85*len(X_train)
    nval=0.15*len(X_train)
    batch_size=20
    epochs=2
    # Number of classes
    num_classes = 2
    torch.manual_seed(8)
    np.random.seed(8)
    random.seed(8)
    
    
    device = torch.device("cpu")
    
      
    X = []
    X_train=np.reshape(np.array(X_train),[len(X_train),])
    for img in list(range(0,len(X_train))):
        if X_train[img].ndim>=3:
            X.append(np.moveaxis(cv2.resize(X_train[img][:,:,:3], (nrows,ncolumns),interpolation=cv2.INTER_CUBIC), -1, 0))
        else:
            smimg= cv2.cvtColor(X_train[img],cv2.COLOR_GRAY2RGB)
            X.append(np.moveaxis(cv2.resize(smimg, (nrows,ncolumns),interpolation=cv2.INTER_CUBIC), -1, 0))
        
        if y_train[img]=='COVID':
            y_train[img]=1
        elif y_train[img]=='NonCOVID' :
            y_train[img]=0
        else:
            continue

    x = np.array(X)
    y_train = np.array(y_train)
    
    
    outputs_all = []
    labels_all = []
    
    X_train, X_val, y_train, y_val = train_test_split(x, y_train, test_size=0.15, random_state=0)
    
    
    
    image_transforms = { 
     'train': transforms.Compose([
         transforms.Lambda(lambda x: x/255),
         transforms.ToPILImage(), 
         transforms.Resize((230, 230)),
         transforms.RandomResizedCrop((224),scale=(0.5,1.0)),       
         transforms.RandomHorizontalFlip(),
         transforms.RandomRotation(10),
         #transforms.ColorJitter(brightness=0.2, contrast=0.2),
         transforms.ToTensor(),
         transforms.Normalize([0.45271412, 0.45271412, 0.45271412],
                             [0.33165374, 0.33165374, 0.33165374])
     ]),
     'valid': transforms.Compose([
         transforms.Lambda(lambda x: x/255),
         transforms.ToPILImage(), 
         transforms.Resize((230, 230)),    
         transforms.CenterCrop(size=224),
         transforms.ToTensor(),
         transforms.Normalize([0.45271412, 0.45271412, 0.45271412],
                             [0.33165374, 0.33165374, 0.33165374])
     ])
    }
    
    
    
    train_data = MyDataset(X_train, y_train,image_transforms['train'])
    
    valid_data = MyDataset(X_val, y_val,image_transforms['valid'])
    
  
    
    dataset_sizes = {
    'train':len(train_data),
    'valid':len(valid_data)
}
    
    dataloaders = {
        'train' : data.DataLoader(train_data, batch_size=batch_size, shuffle=True,
                            pin_memory=True, worker_init_fn=np.random.seed(7), drop_last=False),
        'valid' : data.DataLoader(valid_data, batch_size=batch_size, shuffle=True,
                            pin_memory=True, worker_init_fn=np.random.seed(7), drop_last=False)
}
    

     
    modelA = DenseNet121(num_classes,pretrained=True)
    num_ftrs1 = modelA.fc.in_features
    checkpoint0 = torch.load('Model_densenet121_state.pth')
    modelA.load_state_dict(checkpoint0) 
        
    modelC = ResidualAttentionModel(2)
    num_ftrs2 = modelC.fc.in_features
    checkpoint1 = torch.load('Model_res_state.pth')
    modelC.load_state_dict(checkpoint1)
    
       
    model = MyEnsemble(modelA, modelC,num_ftrs1,num_ftrs2)
    
    
    for param in modelC.parameters():
            param.requires_grad_(False) 
        
    for param in modelA.parameters():
             param.requires_grad_(False) 
    

    criterion = nn.CrossEntropyLoss()
    #optimizer = optim.SGD(model.parameters(), lr=0.006775, momentum=0.5518,weight_decay=0.000578)
    #optimizer = optim.SGD(model.parameters(), lr=0.006775, momentum=0.5518,weight_decay=0.000578)
    optimizer = optim.Adam(model.parameters(), lr=0.0001,weight_decay=0.05)
    #scheduler =  lr_scheduler.CosineAnnealingLR(optimizer, T_max=10)
    scheduler = lr_scheduler.StepLR(optimizer, step_size=35, gamma=0.1)
    
   
    best_acc = -1
    best_f1 = 0.0
    best_epoch = 0
    best_loss = 100000
    since = time.time()
    writer = SummaryWriter()
    
    model.train()
    
    for epoch in range(epochs): 
            print('epoch',epoch)
            jj=0
            for phase in ['train', 'valid']:
                if phase == 'train':
                    model.train()  # Set model to training mode
                else:
                    model.eval()   # Set model to evaluate mode

                running_loss = 0.0
                running_corrects = 0
                predictions=FloatTensor()
                all_labels=FloatTensor()
               

                # Iterate over data.
                for inputs, labels in dataloaders[phase]:
                    #inputs = inputs.to(device, non_blocking=True)
                    inputs = inputs.to(device, non_blocking=True)
                    labels = labels.to(device, non_blocking=True)
                    predictions = predictions.to(device, non_blocking=True)
                    all_labels = all_labels.to(device, non_blocking=True)

                # zero the parameter gradients
                    optimizer.zero_grad()

                # forward
                # track history if only in train
                    with torch.set_grad_enabled(phase == 'train'):
                         outputs = model(inputs)
                         _, preds = torch.max(outputs, 1)
                         loss = criterion(outputs, labels)
                    
                         predictions=torch.cat([predictions,preds.float()])
                         all_labels=torch.cat([all_labels,labels.float()])
                    
                    # backward + optimize only if in training phase
                         if phase == 'train':
                       
                               loss.backward()
                               optimizer.step()
                        
                                
                         if phase == 'train':
                                     jj+= 1
                                    
                                     if len(inputs) >=16 :
                                            
                                             #print('len(inputs)',len(inputs),i)
                                             writer.add_figure('predictions vs. actuals epoch '+str(epoch)+' '+str(jj) ,
                                             plot_classes_preds(model, inputs, labels))
                                            
                           
                        

                # statistics
                    running_loss += loss.item() * inputs.size(0)
                    running_corrects += torch.sum(preds == labels.data)
                
                
                
                if phase == 'train':
                    scheduler.step()
               
               
                epoch_f1=f1_score(all_labels.tolist(), predictions.tolist(),average='weighted')
                print(phase, 'confusion_matrix',confusion_matrix(all_labels.tolist(), predictions.tolist()))
                epoch_loss = running_loss / dataset_sizes[phase]
                epoch_acc = accuracy_score(all_labels.tolist(), predictions.tolist())
               

                print('{} Loss: {:.4f} Acc: {:.4f} f1: {:.4f}'.format(
                phase, epoch_loss, epoch_acc,epoch_f1))

                # Record training loss and accuracy for each phase
                if phase == 'train':
                    writer.add_scalar('Train/Loss', epoch_loss, epoch)
                    writer.add_scalar('Train/Accuracy', epoch_acc, epoch)
                
                    writer.flush()
                elif phase == 'valid':
                    writer.add_scalar('Valid/Loss', epoch_loss, epoch)
                    writer.add_scalar('Valid/Accuracy', epoch_acc, epoch)
                    writer.flush()

            # deep copy the model
                if phase == 'valid' and epoch_acc > best_acc:
                
                    best_f1 = epoch_f1
                    best_acc = epoch_acc
                    best_loss = epoch_loss
                    best_epoch = epoch
                    best_model_wts = copy.deepcopy(model.state_dict())
                    best_model_wts_module = copy.deepcopy(model.state_dict())
               

     
    model.load_state_dict(best_model_wts_module)
    torch.save(model, "Model_ensemble.pth")
    torch.save(best_model_wts,"Model_ensemble_state.pth")
    time_elapsed = time.time() - since
        
    print('Training complete in {:.0f}m {:.0f}s'.format(
    time_elapsed // 60, time_elapsed % 60))
    print('Best valid Acc: {:4f}'.format(best_acc))
    print('Best valid f1: {:4f}'.format(best_f1))
    print('best epoch: ', best_epoch)
        
    model.classifier2 = nn.Identity()
   
    for param in model.parameters():
             param.requires_grad_(False)
            
    clf1 = svm.SVC(kernel='rbf', probability=True)
    all_best_accs = {}
    all_best_f1s = {}
    clf2 = ExtraTreesClassifier(n_estimators=40, max_depth=None, min_samples_split=30, random_state=0)
    
    for phase in ['train','valid']:
                outputs_all = []
                labels_all = []
                model.eval()   # Set model to evaluate mode

                # Iterate over data.
                for inputs, labels in dataloaders[phase]:
                    inputs = inputs.to(device, non_blocking=True)
                    labels = labels.to(device, non_blocking=True)
                  
                    outputs = model(inputs)
                    #print(outputs.shape)
                    outputs_all.append(outputs)
                    labels_all.append(labels)
                    
                outputs = torch.cat(outputs_all)
                #print('outputss',outputs.shape)
                labels = torch.cat(labels_all)
                
                 # fit the classifier on training set and then predict on test 
                if phase == 'train': 
                         clf1.fit(outputs.cpu(), labels.cpu())
                         clf2.fit(outputs.cpu(), labels.cpu())
                         filename1 = 'classifier_SVM.sav'
                         filename2 = 'classifier_ExtraTrees.sav'
                        
                         joblib.dump(clf1, filename1)
                         joblib.dump(clf2, filename2)
                         all_best_accs[phase]=accuracy_score(labels.cpu(), clf1.predict(outputs.cpu()))
                         all_best_f1s[phase]= f1_score(labels.cpu(), clf1.predict(outputs.cpu()))
                         print(phase, 'confusion_matrix of SVM',confusion_matrix(labels.cpu(), clf1.predict(outputs.cpu())))   
                         print(phase, 'confusion_matrix of ExtraTrees',confusion_matrix(labels.cpu(), clf2.predict(outputs.cpu())))   
                if phase == 'valid' :
                         predict = clf1.predict(outputs.cpu())
                         all_best_accs[phase]=accuracy_score(labels.cpu(), clf1.predict(outputs.cpu()))
                         all_best_f1s[phase]= f1_score(labels.cpu(), clf1.predict(outputs.cpu()))
                         print(phase, 'confusion_matrix of SVM',confusion_matrix(labels.cpu(), clf1.predict(outputs.cpu())))   
                         print(phase, 'confusion_matrix of ExtraTrees',confusion_matrix(labels.cpu(), clf2.predict(outputs.cpu()))) 
                          
                            
    print('Best Acc: ',all_best_accs)
    print('Best f1: ',all_best_f1s)
    
   
    return model
        
        
        
        
    

def predict(X_test,model_main=None):
  
    i = 0
    nrows=256
    ncolumns=256
    num_classes = 2
    bs = 20
    device = torch.device("cpu")
    
    modelA = DenseNet121(num_classes,pretrained=True)
    num_ftrs1 = modelA.fc.in_features
        
    modelB = ResidualAttentionModel(2)
    num_ftrs2 = modelB.fc.in_features
      
    model_main = MyEnsemble(modelA, modelB,num_ftrs1,num_ftrs2)
    checkpoint0 = torch.load("Model_ensemble_state.pth")
    model_main.load_state_dict(checkpoint0)
    
    for param in model_main.parameters():
             param.requires_grad_(False) 
     
    model_main = nn.DataParallel(model_main)
    X_t = []
    X_test=np.reshape(np.array(X_test),[len(X_test),])
    
    for img in list(range(0,len(X_test))):
        if X_test[img].ndim>=3:
            X_t.append(np.moveaxis(cv2.resize(X_test[img][:,:,:3], (nrows,ncolumns), interpolation=cv2.INTER_CUBIC), -1, 0))
        else:
            smimg= cv2.cvtColor(X_test[img],cv2.COLOR_GRAY2RGB)
            X_t.append(np.moveaxis(cv2.resize(smimg, (nrows,ncolumns), interpolation=cv2.INTER_CUBIC), -1, 0))
       

    x = np.array(X_t)
    y_pred=[]
    
    torch.manual_seed(0)
    np.random.seed(0)
    random.seed(0)
    device = torch.device("cpu")
    
   
   
    model_main.eval()
    
    image_transforms = transforms.Compose([
        transforms.Lambda(lambda x: x/255),
        transforms.ToPILImage(), 
            transforms.Resize((230, 230)),
        transforms.CenterCrop(size=224),
        transforms.ToTensor(),
        transforms.Normalize([0.45271412, 0.45271412, 0.45271412],
                             [0.33165374, 0.33165374, 0.33165374])
     ])
    
    
    dataset = MyDataset_test(x,image_transforms)
    dataloader = DataLoader(
    dataset,
    batch_size=bs,
    pin_memory=True,worker_init_fn=np.random.seed(0), drop_last=False)
    
    
    for inputs in dataloader:
        #inputs = torch.from_numpy(inputs).float()
        inputs = inputs.to(device, non_blocking=True)
        outputs = model_main(inputs)
        _, preds = torch.max(outputs, 1)
        
        #pred = clf.predict(outputs.cpu())
        for ii in range(len(preds)):
           if preds[ii] > 0.5:
               y_pred.append('COVID')
           
           else:
               y_pred.append('NonCOVID')
            
        i+=1
        if i% math.ceil(len(X_test)/bs)==0:
               break
    
    model_main.classifier2 = nn.Identity()
    
    
    clf = loaded_model = joblib.load('classifier_ExtraTrees.sav')
    for param in model_main.parameters():
             param.requires_grad_(False)
    y_pred2=[]
    for inputs in dataloader:
        inputs = inputs.to(device, non_blocking=True)
        outputs = model_main(inputs)
        preds = clf.predict(outputs)
        
        for ii in range(len(preds)):
           if preds[ii] > 0.5:
               y_pred2.append('COVID')
            
           else:
               y_pred2.append('NonCOVID')
           
        i+=1
        if i% math.ceil(len(X_test)/bs)==0:
               break
                
    return y_pred,y_pred2


dbfile = open('sample.pickle', 'rb')      
db = pickle.load(dbfile) 



model = estimate(db['X_tr'],db['y_tr'])


dbfile = open('sample.pickle', 'rb')      
db_test = pickle.load(dbfile) 
            
            
y_pred,y_pred2 = predict(db_test['X_tr'])
print(y_pred)
print(db_test['y_tr'])
acc= accuracy_score(db_test['y_tr'], y_pred)
acc2= accuracy_score(db_test['y_tr'], y_pred2)
print(acc,acc2)
print(confusion_matrix(db_test['y_tr'], y_pred))
print(confusion_matrix(db_test['y_tr'], y_pred2))

#print(acc,acc2)
