import numpy as np
import random

n = 8  # side length - 2
x = np.full((n,n,n),1)

def drillPath(l=6,directions=[1,2]):
	pos = np.array([random.randint(0,n-1) for i in range(3)])
	for i in range(l):
		idx = random.choice(directions)
		pos[idx] = (pos[idx]+1)%n
		x[pos[0],pos[1],pos[2]] = 0

for i in range(5):
	drillPath(l=random.randint(4,7),directions=random.choice([[0,2],[0,1],[1,2]]))

# pad it back up
y = np.full((n+2,n+2,n+2),True)
for i in range(1,n+1):
	for j in range(1,n+1):
		for k in range(1,n+1):
			y[i][j][k] = x[i-1][j-1][k-1]
for j in range(1,n+1):
    for k in range(1,n+1):
        y[0][j][k] = 0


print(x)
print(y)

with open("map.txt", 'w') as f:
	for xi in y:
		f.write("---\n")
		for xij in xi:
			for xijk in xij:
				f.write(str(int(xijk)))
			f.write("\n")
