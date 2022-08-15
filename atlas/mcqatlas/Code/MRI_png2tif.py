import os
import re
import cv2

def data_needed(filePath):
    import os
    file_name = []
    for i in os.listdir(filePath):
        data_collect = ''.join(i)
        file_name.append(data_collect)
    print("File name obtained.")
    return(file_name)

if __name__ == "__main__":

    # MRI file
    file_path = r"D:\wcs\web\molicaca.github.io-master\molicaca.github.io-master\atlas\mcqatlas\Nissil_new\MBNA_label_2D"
    save_path = r"D:\wcs\web\molicaca.github.io-master\molicaca.github.io-master\atlas\mcqatlas\Nissil_new\MBNA_label_2D"
    data_list = data_needed(file_path)
    for filename in data_list:
        if re.match('R04B.*MBNA.*',filename):
            print(filename[:-15] + '_01.tif')
            # img = cv2.imread(file_path + '\\' + filename)
            # cv2.imwrite(save_path + '\\' + filename[:-15] + '_01.tif', img)
            os.remove(file_path + '\\' + filename)
