import os
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

    # # MRI file
    # file_path = r"D:\wcs\web\molicaca.github.io-master\molicaca.github.io-master\atlas\mcqatlas\Nissil_new\MRI"
    # data_list = data_needed(file_path)
    # for filename in data_list:
    #     if re.match('R04C.*N\d*.tif',filename):
    #         print(filename[:-4] + '_01.tif')
    #         os.rename(file_path + '\\' + filename, file_path + '\\' + filename[:-4] + '_01.tif')
    
    # # BF file
    # file_path = r"D:\wcs\web\molicaca.github.io-master\molicaca.github.io-master\atlas\mcqatlas\Nissil_new\BF"
    # data_list = data_needed(file_path)
    # for filename in data_list:
    #     if re.match('.*BF.png',filename):
    #         print(filename[:-6] + '.png')
    #         os.rename(file_path + '\\' + filename, file_path + '\\' + filename[:-6] + '.png')


    # MRI file
    file_path = r"D:\wcs\web\molicaca.github.io-master\molicaca.github.io-master\atlas\mcqatlas\Nissil_new\MRI"
    data_list = data_needed(file_path)
    for filename in data_list:
        if re.match('R04B.*tif',filename):
            print(filename[:-4] + '_01.tif')
            os.rename(file_path + '\\' + filename, file_path + '\\' + filename[:-4] + '_01.tif')