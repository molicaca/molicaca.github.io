import json
import re

def data_needed(filePath):
    import os
    file_name = []
    for i in os.listdir(filePath):
        data_collect = ''.join(i)
        file_name.append(data_collect)
    print("File name obtained.")
    return(file_name)

if __name__ == "__main__":
    file_path = r"D:\wcs\web\molicaca.github.io-master\molicaca.github.io-master\atlas\mcqatlas\Nissil_new\BF"
    data_list = data_needed(file_path)
    elem_list = []
    AC_list = []
    for i, elem in enumerate(data_list):
        if re.match('R04B.*',elem):
            print(elem)
            elem_list.append(elem[:-4])
        else:
            AC_list.append(elem[:-4])
    print(elem_list)

    with open("../name_B.json","w") as f:
        json.dump({"name":elem_list},f)
    with open("../name_AC.json","w") as f:
        json.dump({"name":AC_list},f)