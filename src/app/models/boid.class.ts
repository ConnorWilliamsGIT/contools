import {coordinate} from './coordinate.type';

export class Boid {
  public pos: coordinate = {x: 0, y: 0};
  public vel: coordinate = {x: 0, y: 0};
  public heading: number = 0;

  public maxSpeed: number = 300;
  public minSpeed: number = 150;
  public protectedRange: number = 20;
  public visualRange: number = 80;
  public separationFactor: number = 0.05;
  public alignmentFactor: number = 0.04;
  public cohesionFactor: number = 0.0001;
  public turnFactor: number = 18;
  public timeLast: number = 0;

  public xIndex: number = 0;
  public yIndex: number = 0;

  constructor(x: number, y: number, heading: number = 0.01) {
    this.pos.x = x;
    this.pos.y = y;
    this.xIndex = Math.floor(this.pos.x / (2 * this.visualRange));
    this.yIndex = Math.floor(this.pos.y / (2 * this.visualRange));
    this.heading = heading;
    this.timeLast = Date.now();
  }

  setCoordinate(coordinate: coordinate) {
    this.pos.x = coordinate.x;
    this.pos.y = coordinate.y;
  }

  computePosition(boids: Boid[], distances: Map<Boid, Map<Boid, number>>, margin: {
    left: number,
    right: number,
    top: number,
    bottom: number
  }) {
    let xVelAvg: number = 0;
    let yVelAvg: number = 0;

    let xPosAvg: number = 0;
    let yPosAvg: number = 0;

    let neighborCount: number = 0;

    boids.forEach((boid, index) => {
      const distance = distances.get(this)?.get(boid) || 0;
      if (distance < this.protectedRange) {
        this.vel.x += (this.pos.x - boid.pos.x) * this.separationFactor;
        this.vel.y += (this.pos.y - boid.pos.y) * this.separationFactor;
      }
      if (distance < this.visualRange && distance > this.protectedRange) {
        xVelAvg += boid.vel.x;
        yVelAvg += boid.vel.y;
        xPosAvg += boid.pos.x;
        yPosAvg += boid.pos.y;
        neighborCount++;
      }
    });

    if (neighborCount > 0) {
      xVelAvg /= neighborCount;
      yVelAvg /= neighborCount;
      this.vel.x += (xVelAvg - this.vel.x) * this.alignmentFactor;
      this.vel.y += (yVelAvg - this.vel.y) * this.alignmentFactor;

      xPosAvg /= neighborCount;
      yPosAvg /= neighborCount;
      this.vel.x += (xPosAvg - this.pos.x) * this.cohesionFactor;
      this.vel.y += (yPosAvg - this.pos.y) * this.cohesionFactor;
    }

    if (this.pos.x < margin.left) {
      this.vel.x += this.turnFactor;
    }
    if (this.pos.x > margin.right) {
      this.vel.x -= this.turnFactor;
    }
    if (this.pos.y < margin.top) {
      this.vel.y += this.turnFactor;
    }
    if (this.pos.y > margin.bottom) {
      this.vel.y -= this.turnFactor;
    }

    let speed = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);

    if (this.vel.x * this.vel.x + this.vel.y * this.vel.y <= 0) {
      speed = 0;
    }

    if (speed > this.maxSpeed) {
      this.vel.x = (this.vel.x / speed) * this.maxSpeed;
      this.vel.y = (this.vel.y / speed) * this.maxSpeed;
    }
    if (speed < this.minSpeed) {
      this.vel.x = (this.vel.x / speed) * this.minSpeed;
      this.vel.y = (this.vel.y / speed) * this.minSpeed;
    }
    if (speed == 0) {
      this.vel.x = this.minSpeed * Math.sin(this.heading + Math.PI);
      this.vel.y = -this.minSpeed * Math.cos(this.heading);
    }

    let timeStep = this.getTimeStep();
    this.pos.x += this.vel.x * timeStep;
    this.pos.y += this.vel.y * timeStep;

    this.heading = Math.atan2(this.vel.y, this.vel.x) + Math.PI / 2;
  }

  getTimeStep() {
    const timeNow = Date.now();
    const timeDiff = timeNow - this.timeLast;
    this.timeLast = timeNow;
    return timeDiff / 1000;
  }
}
