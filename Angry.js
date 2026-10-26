class Angry {
  constructor() {
    this.maxLen = 160;
    this.yOffset = 8;
    this.seed = 100;
  }

speak() {
  let ay = 0;

  if (
    typeof accelerationY !== "undefined" &&
    Number.isFinite(accelerationY)
  ) {
    ay = accelerationY;
  }

  // Measure movement strength in either direction.
  let strength = Math.abs(ay);

  // very low voice
  return map(strength, 0, 15, -0.3, -6.2, true);
}

draw() {

  background(0);
//E: trying with both axis
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
  
/*/
  let speed = map(ry, -90, 90, -0.05, 0.05, true);

  this.yOffset += speed;
  randomSeed(this.seed);

  push();

  translate(width / 2, height / 2 + 250);
  this.branch(this.maxLen, 0);

  pop(); */

  //E: 
  let speed = map(combinedMotion, -90, 90, -0.03, 0.03, true);

  this.yOffset += speed;

  randomSeed(this.seed);
  push();
  translate(width / 2, height / 2 + 250);
  this.branch(this.maxLen, 0);
  pop();
  
}

  branch(len, xOffset) {
    if (len > 10) {
      let w = map(len, 10, this.maxLen, 7, 18);

      strokeWeight(w);
      //E:
      stroke(74,0,0);

      line(0, 0, 0, -len);
      translate(0, -len);

      len *= 0.67;
//E:
      let branches = floor(random(3, 4));

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
    let r = random(187, 255); 
    let g = random(50, 150);
    let b = random(0, 15);
    /*
    let g = 150 + random(-20, 20);
    let b = 80 + random(-20, 20);
    */

    // fill(r);//, g, b, 150);
    // Redish 
    fill(r, g, b,240);
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