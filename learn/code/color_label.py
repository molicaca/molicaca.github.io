import zlib
import re
import struct
import png

file_path = "../data/color_label.txt"

line_num = 0
lines = []
with open(file_path, 'r', encoding='utf-8') as f:
    for line in f:
        if line_num>13:
            if line_num<114:
                line = line.strip('\n').split('\t')
                line = re.split(' +',line[0][2:27])
                line = line[2:5]
                tmp = []
                for elem in line:
                    tmp.append(int(elem))
                tmp.append(255)
                lines.append(tmp)

                print(tmp)
            else:
                line = line.strip('\n').split('\t')
                line = re.split(' +',line[0][2:27])
                line = line[1:4]
                tmp = []
                for elem in line:
                    tmp.append(int(elem))
                tmp.append(255)
                lines.append(tmp)
                print(tmp)
        line_num = line_num + 1
lines[0][3] = 0


width = 305
height = 1
img = []
for y in range(height):
    row = ()
    for x in range(width):
        row = row + tuple(lines[x])
    img.append(row)
with open('../data/colormap.png', 'wb') as f:
    w = png.Writer(width, height,alpha=True, greyscale=False)
    w.write(f, img)
