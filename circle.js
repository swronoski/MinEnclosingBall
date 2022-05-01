let points = [];
//[(21.4, 17.2), (27.4, 4), (8.9, -35.3), (-6.1, -7.2), (-6, -0.1), (-12.3, -22.6), (18.5, 21.7), (16.4, -27.8), (-6.7, 8.7), (-6.9, -6.9), (0.4, 5.1), (-6.1, -29.3), (-6.1, -29.3), (-8.9, -26), (-6.1, -29.3), (29.6, -18.8), (-4, -22), (15.2, 21.2)]
//let points = [[1, 1], [2, 1], [1, 4], [-1, 2], [-2, -3], [0, -2], [-5, -3]];
//let points = [[1, -1], [2, -1], [1, -4], [-1, -2], [-2, 3], [0, 2], [-5, 3]];
let finalCircle = null;
let scaleFactor = 10;
let outputDiv;

let useRandom = false;

function setup() {
  createCanvas(400, 400);
  
  if(useRandom){
    let numPoints = random(3, 10);
  
    for(let p = 0; p < numPoints; p++){
      let newPoint = [ random(50, width-50), random(50, height-50) ];
      points.push(newPoint);
    }
    
    constructMEB();
  } else {
    let calcButton = createButton("Construct MEB");
    calcButton.mouseClicked(constructMEB);
    
    let resetButton = createButton("Reset");
    resetButton.mouseClicked(reset);
  }
  
  outputDiv = createDiv();
  outputDiv.style("width", width);
}


function draw() {
   background(200);
   
  
   
   
   translate(width/2, height/2);
   scale(scaleFactor);
   
   // axis
   strokeWeight(0.1);
   stroke(160);
   for(let x = -width/2/scaleFactor; x < width/2/scaleFactor; x++){
     line(x, -height/2, x, height/2);
   }
   
   for(let y = -height/2/scaleFactor; y < height/2/scaleFactor; y++){
     line(-width/2, y, width/2, y);
   }
   
   // circle
   noFill();
   stroke(0, 0, 255);
   if(finalCircle != null){
     circle(finalCircle[1][0], finalCircle[1][1], finalCircle[0]*2);
   } 
   
   // center point
   strokeWeight(0.3);
   stroke(120);
   point(0,0);
   
   // points
   strokeWeight(0.45);
   stroke(255, 0, 0);
   
   for(let p = 0; p < points.length; p++){
     point(points[p][0], points[p][1]);
   }
   
    
}

// Function to find minimum enclosing ball of a set
// given two points on the boundary.
function MinBallWith2Points(A, p, q){
    let disc = Ball(p, q);
    for (let i = 0; i < A.length; i++){
        if (Math.pow(A[i][0] - disc[1][0], 2) + Math.pow(A[i][1] - disc[1][1], 2) > Math.pow(disc[0], 2)){
            disc = circle3pts(A[i], p, q);
        }
    }
    return disc;
}

// Function to find minimum enclosing ball of a set given
// one point on the boundary.
function MinBallWithPoint(A, q){
    A = randomizeArray(A);
    let disc = Ball(A[0], q);
    for (let i = 1; i < A.length; i++){
        if (Math.pow(A[i][0] - disc[1][0], 2) + Math.pow(A[i][1] - disc[1][1], 2) > Math.pow(disc[0], 2)){
            disc = MinBallWith2Points(A.slice(0,i), A[i], q);
        }
    }
    return disc;
}

// Function to find minimum enclosing ball of a set of points
function MinEnclosingBall(A){
  //print(A);
  A = randomizeArray(A);
  //print(A);
 
  let disc = A[0];
  if (A.length > 1){
    disc = Ball(A[0], A[1]);
    for (let i = 2; i < A.length; i++){
      if (Math.pow(A[i][0] - disc[1][0], 2) + Math.pow(A[i][1] - disc[1][1], 2) > Math.pow(disc[0], 2)){     
        disc = MinBallWithPoint(A.slice(0,i), A[i]);
      }
    }  
  }
  
  //print("A", A);
  //print("MinEnclosingBall", disc);
  
  return disc;
}

// Function to find circle given points on a bisector
function Ball(p, q){
    let x1 = p[0];
    let x2 = q[0];
    let y1 = p[1];
    let y2 = q[1];

    let radius = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))/2;
    let center = [(x1 + x2) / 2, (y1 + y2) / 2];
    let disc = [radius, center];
    return disc;
}

// Function to find circle defined by three points
function circle3pts(o, p, q){
    let x1 = o[0];
    let x2 = p[0];
    let x3 = q[0];
    let y1 = o[1];
    let y2 = p[1];
    let y3 = q[1];

    let a = x1*(y2 - y3) - y1*(x2-x3) + x2*y3 - x3*y2;
    let b = (Math.pow(x1, 2) + Math.pow(y1, 2)) * (y3 - y2) + (Math.pow(x2, 2) + Math.pow(y2, 2)) * (y1 - y3) + (Math.pow(x3, 2) + Math.pow(y3, 2)) * (y2 - y1);
    let c = (Math.pow(x1, 2) + Math.pow(y1, 2)) * (x2 - x3) + (Math.pow(x2, 2) + Math.pow(y2, 2)) * (x3 - x1) + (Math.pow(x3, 2) + Math.pow(y3, 2)) * (x1 - x2);
    let d = (Math.pow(x1, 2) + Math.pow(y1, 2))*(x3*y2 - x2*y3) + (Math.pow(x2, 2) + Math.pow(y2, 2))*(x1*y3 - x3*y1) + (Math.pow(x3, 2) + Math.pow(y3, 2))*(x2*y1 - x1*y2);
    let center = [-b/(2*a), -c/(2*a)];
    let radius = Math.sqrt((Math.pow(b, 2) + Math.pow(c, 2) - 4*a*d)/(4*(Math.pow(a, 2))));
    let disc = [radius, center];
    return disc;    
}

function reset(){
  points = [];
  finalCircle = null;
  outputDiv.html("");
}

function constructMEB(){
  finalCircle = MinEnclosingBall([...points]);
  
  let output = "";
  
  let selectedPoints = "[";
  for(let p = 0; p < points.length; p++){
    selectedPoints += "<span class='points'>(" + points[p][0] + ", " + -points[p][1] + ")</span>";
    if(p < points.length-1){
    selectedPoints += ", ";
    }
  }
  selectedPoints += "]";
  
  output += "<b style='color: #4a799c;'>Selected Points:</b> " + selectedPoints;
  output += "<br />";
  
  output += "<b style='color: #4a799c;'>MEB Radius:</b> " + nfc(finalCircle[0], 5);
  output += "<br />";
  
  output += "<b style='color: #4a799c;'>MEB Center:</b> (" + nfc(finalCircle[1][0], 5) + ", " + -nfc(finalCircle[1][1], 5) + ")";
  
  outputDiv.html(output);
}

function randomizeArray(myArr) {      
  let l = myArr.length, temp, index;  
  while (l > 0) {  
    index = Math.floor(Math.random() * l);  
    l--;  
    temp = myArr[l];          
    myArr[l] = myArr[index];          
    myArr[index] = temp;      
  }    
  return myArr;    
} 

function mouseClicked(){
  
  if((mouseX-width/2)/scaleFactor <= width/2/scaleFactor && (mouseX-width/2)/scaleFactor >= -width/2/scaleFactor &&
     (mouseY-height/2)/scaleFactor >= -height/2/scaleFactor && (mouseY-height/2)/scaleFactor <= height/2/scaleFactor
  ){
    points.push([(mouseX-width/2)/scaleFactor, (mouseY-height/2)/scaleFactor]);
  } else {
    print([(mouseX-width/2)/scaleFactor, (mouseY-height/2)/scaleFactor]);
  }
}

function keyPressed(){
  if(key == "C" || key == "c"){
    constructMEB();
  } else if (key == "r" || key == "R"){
    reset();
  }
}
