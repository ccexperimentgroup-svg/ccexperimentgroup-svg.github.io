// https://p5js.org/examples/Repetition-Recursive-Tree/

class Scary {
  constructor() {
    this.maxLen = 100;
    this.branchCount = 2;
    this.maxDepth = 5;

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

  // Stronger movement makes the voice faster and higher-pitched.
  // Adjust 15 to change the sensitivity.
  return map(strength, 0, 15, 0.3, 1.2, true);
}

  draw() {
    background(255);

    let rx = 0;
    let ry = 0;

    if (
      typeof rotationX !== "undefined" &&
      Number.isFinite(rotationX)
    ) {
      rx = rotationX;
    }

    if (
      typeof rotationY !== "undefined" &&
      Number.isFinite(rotationY)
    ) {
      ry = rotationY;
    }

    // X-axis tilt controls the initial branch length (60–140).
    this.maxLen = map(rx, -90, 90, 30, 200, true);

    // X-axis tilt controls the number of branches per split (1–2).
    this.branchCount = round(
      map(rx, -90, 90, 1, 3, true)
    );

    // Y-axis tilt controls the animation speed and direction.
    let speed = map(
      ry, -90, 90, -0.03, 0.03, true
    );

    this.yOffset += speed;

    // Keep leaf colors consistent between frames.
    randomSeed(this.seed);

    push();

    // Use degrees for this class's drawing operations.
    angleMode(DEGREES);

    translate(width / 2, height / 2 + 250);

    // Start drawing the tree at depth 0.
    this.branch(this.maxLen, 0, 0);

    pop();
  }

  branch(len, xOffset, depth) {
    // Draw a leaf and stop when the branch is too short
    // or the maximum recursion depth is reached.
    if (len <= 10 || depth >= this.maxDepth) {
      this.drawLeaf();
      return;
    }

    let w = map(
      len, 10, this.maxLen, 5, 15, true
    );

    strokeWeight(w);
    stroke(0);

    // Draw the branch and move to its tip.
    line(0, 0, 0, -len);
    translate(0, -len);

    // Make the next branches shorter.
    let nextLen = len * 0.67;

    for (let i = 0; i < this.branchCount; i++) {
      // Give each child branch a different noise offset.
      let nextOffset = xOffset * 2 + i + 1;

      let angle = map(
        noise(nextOffset, this.yOffset),
        0, 1,
        -90, 90
      );

      push();

      rotate(angle);
      this.branch(nextLen, nextOffset, depth + 1);

      pop();
    }
  }

  drawLeaf() {
    let shade = random(60, 100);
    let rad = 15;

    push();

    fill(shade);
    noStroke();

    beginShape();

    // Use 5-degree steps to reduce the number of vertices.
    for (let i = 45; i < 135; i += 5) {
      let x = rad * cos(i);
      let y = rad * sin(i);

      vertex(x, y);
    }

    for (let j = 135; j > 40; j -= 5) {
      let x = rad * cos(j);
      let y = rad * sin(-j) + 20;

      vertex(x, y);
    }

    endShape(CLOSE);

    pop();
  }
}