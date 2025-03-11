import {coordinate} from "./coordinate.type";

export class Ball {
  public pos: coordinate;
  public vel: coordinate;
  speed: number = 5;
  radius: number;
  color: string;

  constructor(x: number, y: number, radius: number = 10, color: string = "white") {
    this.pos = {x: x, y: y};
    this.vel = {x: 1, y: 1};
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

  update() {
    this.pos.x += this.vel.x * this.speed;
    this.pos.y += this.vel.y * this.speed;
  }
}
