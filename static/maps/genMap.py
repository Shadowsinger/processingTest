
import sys

size = int(sys.argv[1])

text = ("---\n" + ("1"*size+"\n")*size)*size
print(text)

fout = open("static/maps/map42.txt", "w")
fout.write(text)

