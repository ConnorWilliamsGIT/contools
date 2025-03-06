import {coordinate} from './coordinate.type';
import {boidInteraction} from './boidInteraction.dict';
import {boidGroups} from './boidType.dict';

export class Boid {
  public pos: coordinate = {x: 0, y: 0};
  public vel: coordinate = {x: 0, y: 0};
  public heading: number = 0;

  public boidType: string = boidGroups['boid']['type'];

  private timeLast = 0;

  public settings = {
    protectedRange: 10,
    visualRange: 80,
    maxSpeed: 300,
    minSpeed: 150,
    turnFactor: 4,
    colour: "white"
  }

  public xIndex: number = 0;
  public yIndex: number = 0;

  constructor(x: number, y: number, boidType: string = boidGroups['boid']['type'], heading: number = 0.01) {
    this.pos.x = x;
    this.pos.y = y;

    this.boidType = boidType;
    this.settings.colour = boidGroups[boidType]['colour'];

    this.xIndex = Math.floor(this.pos.x / (2 * this.settings.visualRange));
    this.yIndex = Math.floor(this.pos.y / (2 * this.settings.visualRange));
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
    let xVelAvg: {[index: string] : number} = {};
    let yVelAvg: {[index: string] : number} = {};

    let xPosAvg: {[index: string] : number} = {};
    let yPosAvg: {[index: string] : number} = {};

    let neighborCount: {[index: string] : number} = {};

    for (let boidGroup in boidGroups) {
      let boidType = boidGroups[boidGroup]['type'];
      xVelAvg[boidType] = 0;
      yVelAvg[boidType] = 0;
      xPosAvg[boidType] = 0;
      yPosAvg[boidType] = 0;
      neighborCount[boidType] = 0;
    }

    boids.forEach((boid, index) => {
      const distance = distances.get(this)?.get(boid) || 0;
      if (distance < this.settings.protectedRange) {
        this.vel.x += (this.pos.x - boid.pos.x) * boidInteraction[this.boidType][boid.boidType].separationFactor;
        this.vel.y += (this.pos.y - boid.pos.y) * boidInteraction[this.boidType][boid.boidType].separationFactor;
      }
      if (distance < this.settings.visualRange && distance > this.settings.protectedRange) {
        this.vel.x += (this.pos.x - boid.pos.x) * boidInteraction[this.boidType][boid.boidType].avoidFactor;
        this.vel.y += (this.pos.y - boid.pos.y) * boidInteraction[this.boidType][boid.boidType].avoidFactor;
        xVelAvg[boid.boidType] += boid.vel.x;
        yVelAvg[boid.boidType] += boid.vel.y;
        xPosAvg[boid.boidType] += boid.pos.x;
        yPosAvg[boid.boidType] += boid.pos.y;
        neighborCount[boid.boidType]++;
      }
    });


    for (let boidGroup in boidGroups) {
      let boidType = boidGroups[boidGroup]['type'];

      if (neighborCount[boidType] > 0) {
        xVelAvg[boidType] /= neighborCount[boidType];
        yVelAvg[boidType] /= neighborCount[boidType];
        this.vel.x += (xVelAvg[boidType] - this.vel.x) * boidInteraction[this.boidType][boidType].alignmentFactor;
        this.vel.y += (yVelAvg[boidType] - this.vel.y) * boidInteraction[this.boidType][boidType].alignmentFactor;

        xPosAvg[boidType] /= neighborCount[boidType];
        yPosAvg[boidType] /= neighborCount[boidType];
        this.vel.x += (xPosAvg[boidType] - this.pos.x) * boidInteraction[this.boidType][boidType].cohesionFactor;
        this.vel.y += (yPosAvg[boidType] - this.pos.y) * boidInteraction[this.boidType][boidType].cohesionFactor;
      }
    }



    if (this.pos.x < margin.left) {
      this.vel.x += this.settings.turnFactor;
    }
    if (this.pos.x > margin.right) {
      this.vel.x -= this.settings.turnFactor;
    }
    if (this.pos.y < margin.top) {
      this.vel.y += this.settings.turnFactor;
    }
    if (this.pos.y > margin.bottom) {
      this.vel.y -= this.settings.turnFactor;
    }

    let speed = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);

    if (this.vel.x * this.vel.x + this.vel.y * this.vel.y <= 0) {
      speed = 0;
    }

    if (speed > this.settings.maxSpeed) {
      this.vel.x = (this.vel.x / speed) * this.settings.maxSpeed;
      this.vel.y = (this.vel.y / speed) * this.settings.maxSpeed;
    }
    if (speed < this.settings.minSpeed) {
      this.vel.x = (this.vel.x / speed) * this.settings.minSpeed;
      this.vel.y = (this.vel.y / speed) * this.settings.minSpeed;
    }
    if (speed == 0) {
      this.vel.x = this.settings.minSpeed * Math.sin(this.heading + Math.PI);
      this.vel.y = -this.settings.minSpeed * Math.cos(this.heading);
    }

    let angleRange = 1;
    let randomAngle = (Math.random() * 2 * angleRange - angleRange) * Math.PI / 180;
    this.vel.x = this.vel.x * Math.cos(randomAngle) - this.vel.y * Math.sin(randomAngle);
    this.vel.y = this.vel.x * Math.sin(randomAngle) + this.vel.y * Math.cos(randomAngle);


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
