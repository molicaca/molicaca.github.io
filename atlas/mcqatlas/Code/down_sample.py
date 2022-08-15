import os
from os.path import join, getsize
import json
import cv2


def getdirsize(dir):
    size = 0
    for root, dirs, files in os.walk(dir):
        size += sum([getsize(join(root, name)) for name in files])
    return size

def size_format(size):
    if size < 1000:
        return '%i' % size + 'size'
    elif 1000 <= size < 1000000:
        return '%.1f' % float(size/1000) + 'KB'
    elif 1000000 <= size < 1000000000:
        return '%.1f' % float(size/1000000) + 'MB'
    elif 1000000000 <= size < 1000000000000:
        return '%.1f' % float(size/1000000000) + 'GB'
    elif 1000000000000 <= size:
        return '%.1f' % float(size/1000000000000) + 'TB'

## python文件被称为模块 
if __name__ == "__main__":
    file_path = r"D:\wcs\web\molicaca.github.io-master\molicaca.github.io-master\atlas\mcqatlas\Nissil_new\x10NS"
    size = 0
    size_str = 0
    file = 0
    dic = {}
    for root, dirs, files in os.walk(file_path):
        size = [getsize(join(root, name)) for name in files]
        size_str = [size_format(getsize(join(root, name))) for name in files]
        file = files
    for index, name in enumerate(file):
        new_img = 0
        dic[name] = size[index]
        img = cv2.imread(file_path + '\\' + name)
        # img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        img_size = img.shape
        if img_size[0] >= 16384:
            new_img = cv2.resize(img, (0, 0), fx=1/2, fy=1/2)
        elif img_size[1] >= 16384:
            new_img = cv2.resize(img, (0, 0), fx=1/2, fy=1/2)
        if type(new_img) != type(0):
            print(name + '  ' + size_str[index])
            cv2.imwrite(file_path + '\\' + name, new_img)
            print("Downsample successly!")
            
        # print(name + '  ' + size_str[index])
        # if size[index] > 400000000:
        #     print(name + '  ' + size_str[index])
        #     img = cv2.imread(file_path + '\\' + name)
        #     img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        #     new_img = cv2.resize(img, (0, 0), fx=1/2, fy=1/2)
        #     print(new_img.shape)
        #     cv2.imwrite(file_path + '\\' + name)
    # dic["name"] = file
    # dic["size"] = size
    # print(dic)
    # with open("../name_new.json","w") as dump_f:
    #     json.dump(dic,dump_f)