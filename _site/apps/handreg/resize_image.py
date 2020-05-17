import os
from PIL import Image
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("input_image", type=str, help="File name of image to resize")
parser.add_argument("output_image", type=str, help="File name of image to resize")
parser.add_argument("size_image", type=int, help="Desired image size")

args = parser.parse_args()

basewidth = args.size_image
img = Image.open(args.input_image)
wpercent = (basewidth/float(img.size[0]))
hsize = int((float(img.size[1])*float(wpercent)))
img = img.resize((basewidth,hsize), Image.ANTIALIAS)
img.save(args.output_image)
