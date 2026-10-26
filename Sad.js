// Fluid Simulation

class Sad {
  constructor() {
    this.maxLen = 130;
    this.yOffset = 8;
    this.seed = 100;
  }


  speak() {
    return (rotationY / 180) * 0.7;
  }

draw() {
  background(0);

//E:
  let rx = 0;
  let ry = 0;

  if (typeof rotationX !== "undefined" && Number.isFinite(rotationX)) {
    rx = rotationX;
  }
  
  if (typeof rotationY !== "undefined" &&
      Number.isFinite(rotationY)) {
    ry = rotationY;
  }

  let combinedMotion = (rx + ry) / 2;

  /*
  let speed = map(ry, -90, 90, -0.03, 0.03, true);

  this.yOffset += speed;
  randomSeed(this.seed);

  push();

  translate(width / 2, height / 2 + 250);
  this.branch(this.maxLen, 0);

  pop(); */
  
  //E: 
  let speed = map(combinedMotion, -90, 90, -0.02, 0.02, true);

  this.yOffset += speed;

  randomSeed(this.seed);
  push();
  translate(width / 2, height / 2 + 250);
  this.branch(this.maxLen, 0);
  pop();
  
}

  branch(len, xOffset) {
    if (len > 10) {
      let w = map(len, 10, this.maxLen, 5, 15);

      strokeWeight(w);
      stroke(1, 31, 75);

      line(0, 0, 0, -len);
      translate(0, -len);

      len *= 0.67;

      let branches = floor(random(2, 4));

      for (let i = 0; i < branches; i++) {
        let angle = map(
          noise(xOffset + i, this.yOffset),
          0, 1,
          -90, 90
        );

        push();
        rotate(angle);
        this.branch(len, xOffset);
        pop();
      }
    } else {
      this.drawLeaf();
    }
  }

  drawLeaf() {
    //E:
    let r = random(0, 100);    
    let g = random(90, 180);   
    let b = random(150, 224); 
    let a = random(160, 220);  
   
    /*
    let r = random(60,100);
    let g = 150 + random(-20, 20);
    let b = 80 + random(-20, 20); 
    */

    //E: 
    fill(r, g, b, a);
    // blue
    /* fill(0, 255, 255);*/
    noStroke();

    let rad = 15;

    beginShape();

    for (let i = 45; i < 135; i++) {
      let x = rad * cos(i);
      let y = rad * sin(i);

      vertex(x, y);
    }

    for (let j = 135; j > 40; j--) {
      let x = rad * cos(j);
      let y = rad * sin(-j) + 20;

      vertex(x, y);
    }

    endShape(CLOSE);
  }
}