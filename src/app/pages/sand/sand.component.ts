import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {sandGrain} from "../../models/sandGrain.class";
import {coordinate} from "../../models/coordinate.type";
import {FormsModule} from "@angular/forms";
import {ActivatedRoute, RouterLink, RouterLinkActive} from "@angular/router";

// pointforce type that extends coordinate
type pointForce = coordinate & { strength: number, radius: number };


@Component({
  selector: 'app-sand',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sand.component.html',
  styleUrl: './sand.component.scss'
})
export class SandComponent implements AfterViewInit {
  @ViewChild("canvas") canvas?: ElementRef;
  @ViewChild("canvasFrame") canvasFrame?: ElementRef;
  @ViewChild('sliderBox', { static: true }) sliderBox!: ElementRef;

  public pageName: string;

  private ctx: any;
  private timeLoop: any;

  private sandGrains: any[] = [];
  private pointForces: pointForce[] = [];

  public windSpeed: any = 100; // in pixels per second
  public sandRate: any = 10; // sand grains per tick

  private framerate: number = 1 / 60; // in seconds
  private windVelocity: coordinate = {x: this.windSpeed, y: 0};
  private maxSandGrains: number = 50000;

  private mousePos: coordinate = {x: 0, y: 0};

  constructor(private route: ActivatedRoute) {
    this.pageName = this.route.snapshot.data['pageName'];
  }

  ngAfterViewInit(): void {
    if (this.canvas === undefined || this.canvasFrame === undefined) {
      console.log("Canvas not found");
      return;
    }
    this.ctx = this.canvas.nativeElement.getContext("2d");

    this.resizeCanvas()

    this.timeLoop = setInterval(() => this.computeSand(), this.framerate * 1000); // framerate in ms


    this.updateCanvas();
  }

  @HostListener('window:resize')
  resizeCanvas() {
    if (this.canvas === undefined || this.canvasFrame === undefined) {
      console.log("Canvas not found");
      return;
    }

    const canvasFrame = this.canvasFrame.nativeElement;

    this.ctx.canvas.width = canvasFrame.clientWidth;
    this.ctx.canvas.height = canvasFrame.clientHeight;

    this.updateCanvas();
  }

  updateCanvas() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = "rgb(245,231,210)";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.draw();
  }

  computeSand() {
    this.spawnSand(this.sandRate);

    this.checkSand();

    this.updateCanvas();
  }

  checkSand(){
    for (let sand of this.sandGrains) {
      // if sand is out of canvas bounds on the right side, delete it from existence
      if (this.windVelocity.x >= 0 && sand.pos.x > this.ctx.canvas.width + 10) {
        this.sandGrains.splice(this.sandGrains.indexOf(sand), 1);
        continue;
      }

      if (this.windVelocity.x < 0 && sand.pos.x < -10) {
        this.sandGrains.splice(this.sandGrains.indexOf(sand), 1);
        continue;
      }

      if (this.windVelocity.y >= 0 && sand.pos.y > this.ctx.canvas.height + 10) {
        this.sandGrains.splice(this.sandGrains.indexOf(sand), 1);
        continue;
      }

      if (this.windVelocity.y < 0 && sand.pos.y < -10) {
        this.sandGrains.splice(this.sandGrains.indexOf(sand), 1);
        continue;
      }

      let forceExerted = {x: 0, y: 0};

      // wind force (probably proportional to the velocity of the grain relative to the wind velocity)
      // update wind velocity from slider
      this.windVelocity.x = this.windSpeed;

      forceExerted.x += this.windVelocity.x - 0.5 * sand.vel.x;
      forceExerted.y += this.windVelocity.y - 0.5 * sand.vel.y;

      // drag force
      forceExerted.x += -0.1 * sand.vel.x;
      forceExerted.y += -0.1 * sand.vel.y;

      // random turbulence
      forceExerted.x += (Math.random() - 0.5) * 500;
      forceExerted.y += (Math.random() - 0.5) * 100;

      // outward force from point forces
      for (let point of this.pointForces) {
        let dirX = sand.pos.x - point.x;
        let dirY = sand.pos.y - point.y;
        let distance = Math.sqrt(dirX * dirX + dirY * dirY);
        // apply force inversely proportional to distance squared
        let forceMagnitude = point.strength / (distance * distance + 10);
        forceExerted.x += (dirX / distance) * forceMagnitude;
        forceExerted.y += (dirY / distance) * forceMagnitude;
      }

      sand.exertForce(forceExerted); // gravity force
      sand.update(this.framerate);
    }
  }

  draw(){
    this.drawSand();
    this.drawPointForces();
  }

  drawSand(){
    for (let sand of this.sandGrains) {
      sand.draw(this.ctx);
    }
  }

  drawPointForces(){
    for (let point of this.pointForces) {
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2, false);
      this.ctx.fillStyle = "rgb(178,98,28)";
      this.ctx.fill();
      this.ctx.closePath();
    }
  }

  spawnSand(int = 1) {
    let sand;
    if  (this.sandGrains.length > this.maxSandGrains) return;

    for (let i = 0; i < int; i++) {
      //let sand = new sandGrain(-10 * Math.random() * this.ctx.canvas.height - 5, Math.random() * this.ctx.canvas.height);
      // create sand on the edge of the canvas up from the current wind direction
      if (this.windVelocity.x >= 0) {
         sand = new sandGrain(-900 * Math.random() - 5, Math.random() * this.ctx.canvas.height);
      } else {
         sand = new sandGrain(this.ctx.canvas.width + 900 * Math.random() + 5, Math.random() * this.ctx.canvas.height);
      }

      this.sandGrains.push(sand);
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) { // On mouse move
    this.mousePos = {x: event.pageX, y: event.pageY};
  }

  // add click listener
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) { // On click
      if (this.sliderBox.nativeElement.contains(event.target)) {
        return;
      }

      const coordinate: coordinate = this.pageToCanvasPos({x: event.pageX, y: event.pageY});

      const strength = 400000;
      const radius = 5;

      const point: pointForce = {x: coordinate.x, y: coordinate.y, strength, radius};
      this.pointForces.push(point);

      this.updateCanvas();
  }


  pageToCanvasPos(coord: coordinate): coordinate {
    return {
      x: coord.x - this.canvasFrame?.nativeElement.offsetLeft,
      y: coord.y - this.canvasFrame?.nativeElement.offsetTop
    }
  }

  clearPointForces() {
  this.pointForces = [];
  this.updateCanvas();
}
}


