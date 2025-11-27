import {coordinate} from "./coordinate.type";

export class sandGrain {
  public pos: coordinate;
  public vel: coordinate;
  public acc: coordinate;
  public mass: number = 1;
  public color: string;
  public radius: number;

  constructor(x: number, y: number, radius: number = 2, color: string = "rgb(213,180,127)") {
    this.pos = {x: x, y: y};
    this.vel = {x: 0, y: 0};
    this.acc = {x: 0, y: 0}; // Simulating gravity
    this.radius = radius;
    this.color = color;
  }

  draw(ctx: any) {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  exertForce(force: coordinate) {
    this.acc.x += force.x / this.mass;
    this.acc.y += force.y / this.mass;
  }

  update(timeDelta: number = 1/60) {
    this.vel.x += this.acc.x * timeDelta;
    this.vel.y += this.acc.y * timeDelta;

    this.pos.x += this.vel.x * timeDelta;
    this.pos.y += this.vel.y * timeDelta;

    this.acc.x = 0;
    this.acc.y = 0;
  }
}

