// https://codepen.io/unicar/pen/LwbRbo

class FlockParams {
  constructor() {
    this.maxForce = 0.09;
    this.maxSpeed = 1.4;
    this.perceptionRadius = 120;
    this.alignAmp = 1;
    this.cohesionAmp = 1.2;
    this.separationAmp = 1.5;
  }
}

let flockParams = new FlockParams();

/*==================
Koi
===================*/

class Koi {
  constructor(x, y, koiColor) {
    this.color = color(koiColor);
    this.position = createVector(x, y);
    // this.offsetX = random(-100, 100);
    // this.offsetY = random(-100, 100);
    // this.position = createVector(x + this.offsetX, y + this.offsetY);
    // this.velocity = p5.Vector.random2D();
    this.velocity = createVector(width * 0.5 - x, height * 0.5 - y);
    this.velocity.setMag(random(1, 8));
    this.acceleration = createVector();
    this.baseSize = int(random(12, 30));
    this.maxForce = flockParams.maxForce;
    this.maxSpeed = flockParams.maxSpeed;
    this.bodyLength = this.baseSize * 2;
    this.body = new Array(this.bodyLength).fill({ ...this.position });
    this.maxSpeed = (flockParams.maxSpeed * this.baseSize) / 30;
  }

  calculateDesiredSteeringForce(kois, factorType) {
    let steering = createVector();
    let total = 0;
    for (let other of kois) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (d < flockParams.perceptionRadius && other != this) {
        switch (factorType) {
          case "align":
            steering.add(other.velocity);
            break;
          case "cohesion":
            steering.add(other.position);
            break;
          case "separation":
            let diff = p5.Vector.sub(this.position, other.position);
            diff.div(d);
            steering.add(diff);
            break;
          default:
            break;
        }
        total++;
      }
    }

    if (total > 0) {
      steering.div(total);
      if (factorType === "cohesion") steering.sub(this.position);
      steering.setMag(flockParams.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(flockParams.maxForce);
    }
    return steering;
  }

  align = (kois) => this.calculateDesiredSteeringForce(kois, "align");

  cohesion = (kois) => this.calculateDesiredSteeringForce(kois, "cohesion");

  separation = (kois) => this.calculateDesiredSteeringForce(kois, "separation");

  avoid(obstacle) {
    let steering = createVector();
    let d = dist(this.position.x, this.position.y, obstacle.x, obstacle.y);
    if (d < flockParams.perceptionRadius) {
      let diff = p5.Vector.sub(this.position, obstacle);
      diff.div(d);
      steering.add(diff);
      steering.setMag(flockParams.maxSpeed * 10);
      steering.sub(this.velocity);
      // steering.limit(flockParams.maxForce);
    }
    return steering;
  }

  attract(attraction) {
    let steering = createVector();
    let d = dist(this.position.x, this.position.y, attraction.x, attraction.y);
    if (d < flockParams.perceptionRadius * 2) {
      let diff = p5.Vector.sub(attraction, this.position);
      diff.mult(d);
      steering.add(diff);
      steering.setMag(flockParams.maxSpeed);
      steering.add(this.velocity);
      steering.limit(flockParams.maxForce * 1.48);
    }
    return steering;
  }

  edges() {
    if (this.position.x > width + 50) {
      this.position.x = -50;
    } else if (this.position.x < -50) {
      this.position.x = width + 50;
    }
    if (this.position.y > height + 50) {
      this.position.y = -50;
    } else if (this.position.y < -50) {
      this.position.y = height + 50;
    }
  }

  flock(kois) {
    this.acceleration.mult(0);
    let alignment = this.align(kois);
    let cohesion = this.cohesion(kois);
    let separation = this.separation(kois);

    let mouseObstacle = createVector(mouseX, mouseY);

    alignment.mult(flockParams.alignAmp);
    cohesion.mult(flockParams.cohesionAmp);
    separation.mult(flockParams.separationAmp);

    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
      if (mouseIsPressed === true) {
        let d = dist(mouseX, mouseY, this.position.x, this.position.y);
        if (d < this.baseSize * 0.6) {
          // this.position = createVector(mouseX, mouseY);
          this.velocity = createVector(
            mouseX - pmouseX,
            mouseY - pmouseY
          ).setMag(flockParams.maxSpeed);
        } else {
          let avoid = this.avoid(mouseObstacle);
          this.acceleration.add(avoid);
        }
      } else {
        let attract = this.attract(mouseObstacle);
        this.acceleration.add(attract);
      }
    }

    this.acceleration.add(separation);
    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);

    this.acceleration.add(p5.Vector.random2D().mult(0.05));
  }

  updateBody() {
    this.body.unshift({ ...this.position });
    this.body.pop();
  }

  show() {
    noStroke();
    this.body.forEach((b, index) => {
      let size;
      if (index < this.bodyLength / 6) {
        size = this.baseSize + index * 1.8;
      } else {
        size = this.baseSize * 2 - index;
      }
      this.color.setAlpha((this.bodyLength - index) * 0.23);
      fill(this.color);
      ellipse(b.x, b.y, size * 0.5, size * 0.5);
    });
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(flockParams.maxSpeed);
    this.updateBody();
  }
}

/*==================
Sketch: setup, draw, etc.
===================*/

const flock = [];
const ripples = [];
const lotusLeaves = [];
let koiNumber = 18;
let posX, posY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  flockParams.perceptionRadius = width * 0.15;
  // print(flockParams.perceptionRadius);
  const color = 0;

  for (i = 0; i < koiNumber; i++) {
    let seed = int(random(4));
    if (seed === 0) {
      posX = random(width);
      posY = random(-70, -40);
    } else if (seed === 1) {
      posX = random(width + 30, width + 60);
      posY = random(height);
    } else if (seed === 2) {
      posX = random(width);
      posY = random(height + 35, height + 70);
    } else {
      posX = random(-50, -28);
      posY = random(height);
    }
    flock.push(new Koi(posX, posY, color));
  }
}

function draw() {
  background(255);

  flock.forEach((koi) => {
    koi.edges();
    koi.flock(flock);
    koi.update();
    koi.show();
  });
}

function windowResized() {
  // this function executes everytime the window size changes

  // set the sketch width and height to the 5 pixels less than
  // windowWidth and windowHeight. This gets rid of the scroll bars.
  resizeCanvas(windowWidth, windowHeight);
  // set background to light-gray
  background(255);
}
