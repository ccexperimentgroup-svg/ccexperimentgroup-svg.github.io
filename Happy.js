// https://youtu.be/XATr_jdh-44


class Happy {
  constructor() {
    this.maxLen = 100;
    this.yOffset = 8;
    this.seed = 100;
  }

  speak() {
    return (rotationY / 180) * 0.9;
  }

  draw() {
  background(0);
  let ry = 0;

  if (typeof rotationY !== "undefined" &&
      Number.isFinite(rotationY)) {
    ry = rotationY;
  }

  let speed = map(ry, -90, 90, -0.03, 0.03, true);

  this.yOffset += speed;
  randomSeed(this.seed);

  push();

  translate(width / 2, height / 2 + 250);
  this.branch(this.maxLen, 0);

  pop();
}

  branch(len, xOffset) {
    if (len > 10) {
      let w = map(len, 10, this.maxLen, 5, 10);

      strokeWeight(w);
      stroke(200);

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
  push();

  // Scale the entire leaf (1.5 = 1.5 times larger)
  scale(1.5);

  let rad = 15;

  // Create a vertical gradient
  let gradient = drawingContext.createLinearGradient(0, -5, 0, 25);

  gradient.addColorStop(0, "#FFF9B0");   // Light yellow
  gradient.addColorStop(0.5, "#FFDF00"); // Golden yellow
  gradient.addColorStop(1, "#FFA500");   // Orange

  noStroke();
  drawingContext.fillStyle = gradient;

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

  pop();
}
}