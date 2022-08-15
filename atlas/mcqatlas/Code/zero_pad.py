from contextlib import nullcontext
from nturl2path import pathname2url
import os
import cv2
import numpy as np

pathname = r'D:\wcs\web\molicaca.github.io-master\molicaca.github.io-master\atlas\mcqatlas\Nissil_new\x10NS'
savepath = r'D:\wcs\web\molicaca.github.io-master\molicaca.github.io-master\atlas\mcqatlas\Nissil_new\x10NS'

files = os.listdir(pathname)
pathlist = []
pathlist = files

for path in pathlist:
    pathin = pathname + '\\' + path
    img = cv2.imread(pathin)
    img = np.pad(img,((1,1),(1,1),(0,0)),'constant')
    print(img.shape)
    pathin = savepath + '\\' + path
    cv2.imwrite(pathin, img)