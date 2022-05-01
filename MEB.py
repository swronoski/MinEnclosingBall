import random
import math


# Function to find circle given points on a bisector
def circle(p, q):
    x1 = p[0]
    x2 = q[0]
    y1 = p[1]
    y2 = q[1]

    radius = math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)/2
    center = [(x1 + x2) / 2, (y1 + y2) / 2]
    disc = [radius, center]
    return disc


# Function to find circle defined by three points
def circle3pts(o, p, q):
    x1 = o[0]
    x2 = p[0]
    x3 = q[0]
    y1 = o[1]
    y2 = p[1]
    y3 = q[1]

    a = x1*(y2 - y3) - y1*(x2-x3) + x2*y3 - x3*y2
    b = (x1**2 + y1**2) * (y3 - y2) + (x2**2 + y2**2) * (y1 - y3) + (x3**2 + y3**2) * (y2 - y1)
    c = (x1**2 + y1**2) * (x2 - x3) + (x2**2 + y2**2) * (x3 - x1) + (x3**2 + y3**2) * (x1 - x2)
    d = (x1**2 + y1**2)*(x3*y2 - x2*y3) + (x2**2 + y2**2)*(x1*y3 - x3*y1) + (x3**2 + y3**2)*(x2*y1 - x1*y2)
    center = [-b/(2*a), -c/(2*a)]
    radius = math.sqrt((b**2 + c**2 - 4*a*d)/(4*(a**2)))
    disc = [radius, center]
    return disc


# Function to find minimum enclosing ball of a set
# given two points on the boundary.
def MinBallWith2Points(A, p, q):
    disc = circle(p, q)
    for i in range(0, len(A)):
        if (A[i][0] - disc[1][0]) ** 2 + (A[i][1] - disc[1][1]) ** 2 > disc[0] ** 2:
            disc = circle3pts(A[i], p, q)
    return disc


# Function to find minimum enclosing ball of a set given
# one point on the boundary.
def MinBallWithPoint(A, q):
    random.shuffle(A)
    disc = circle(A[0], q)
    for i in range(1, len(A)):
        if (A[i][0] - disc[1][0]) ** 2 + (A[i][1] - disc[1][1]) ** 2 > disc[0] ** 2:
            disc = MinBallWith2Points(A[0:i], A[i], q)
    return disc


# Function to find minimum enclosing ball of a set of points
def MinEnclosingBall(A):
    random.shuffle(A)
    if len(A) == 1:
        disc = A[0]
    else:
        disc = circle(A[0], A[1])
        for i in range(2, len(A)):
            if (A[i][0] - disc[1][0]) ** 2 + (A[i][1] - disc[1][1]) ** 2 > disc[0] ** 2:
                disc = MinBallWithPoint(A[0:i], A[i])
    return disc


points = [(1, 1), (2, 1), (1, 4), (-1, 2), (-2, -3), (0, -2), (-5, -3)]

if __name__ == '__main__':
    print(MinEnclosingBall(points))
