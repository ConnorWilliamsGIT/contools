import {coordinate} from './coordinate.type';

export class Boid {
  public pos : coordinate = {x: 0, y: 0};
  public vel : coordinate = {x: 0, y: 0};
  public heading : number = 0;

  private maxSpeed : number = 300;
  private minSpeed : number = 80;
  private protectedRange : number = 50;
  private visualRange : number = 100;
  private separationFactor : number = 0.05;
  private alignmentFactor : number = 0.01;
  private cohesionFactor : number = 0.0005;
  private turnFactor : number = 4;
  private timeLast : number = 0;

  constructor(x: number, y: number, heading: number = 0) {
    this.pos.x = x;
    this.pos.y = y;
    this.heading = heading;
    this.timeLast = Date.now();
  }

  setCoordinate(coordinate: coordinate) {
    this.pos.x = coordinate.x;
    this.pos.y = coordinate.y;
  }

  computePosition(boids: Boid[], distances: number[][], thisIndex: number, margin: {left: number, right: number, top: number, bottom: number}) {
    let xVelAvg : number = 0;
    let yVelAvg : number = 0;

    let xPosAvg : number = 0;
    let yPosAvg : number = 0;

    let neighborCount : number = 0;

    boids.forEach((boid, index) => {
      if (index === thisIndex) {
        return;
      }


      const distance = distances[thisIndex][index];
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

    const speed = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
    if (speed > this.maxSpeed) {
      this.vel.x = (this.vel.x / speed) * this.maxSpeed;
      this.vel.y = (this.vel.y / speed) * this.maxSpeed;
    }
    if (speed < this.minSpeed) {
      this.vel.x = (this.vel.x / speed) * this.minSpeed;
      this.vel.y = (this.vel.y / speed) * this.minSpeed;
    }

    let timeStep = this.getTimeStep();

    this.pos.x += this.vel.x * timeStep;
    this.pos.y += this.vel.y * timeStep;

    this.heading = Math.atan2(this.vel.y, this.vel.x) + Math.PI/2;
  }

  getTimeStep() {
    const timeNow = Date.now();
    const timeDiff = timeNow - this.timeLast;
    this.timeLast = timeNow;
    return timeDiff/1000;
  }
}
