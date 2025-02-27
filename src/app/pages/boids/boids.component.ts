import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {LayoutComponent} from "../../components/layout/layout.component";
import {Boid} from "../../models/boid.class";
import {coordinate} from "../../models/coordinate.type";

@Component({
  selector: 'app-boids',
  standalone: true,
  imports: [
    LayoutComponent
  ],
  templateUrl: './boids.component.html',
  styleUrl: './boids.component.scss'
})

export class BoidsComponent implements AfterViewInit {
  @ViewChild("canvas") canvas?: ElementRef;
  @ViewChild("canvasFrame") canvasFrame?: ElementRef;
  @ViewChild("image") image?: ElementRef;
  @ViewChild("deleteButton") deleteButton?: ElementRef;
  @ViewChild("resetButton") resetButton?: ElementRef;

  private ctx: any;
  private boidList: Boid[] = [];




  ngAfterViewInit(): void {
    if (this.canvas === undefined || this.canvasFrame === undefined) {
      console.log("Canvas not found");
      return;
    }

    // todo add regularly updating spinners
    // example of code running continuously
    const p = setInterval(() => {
      this.computeBoids();
    }, 10)
    // setTimeout(() => clearInterval(p), 5000);

    this.ctx = this.canvas.nativeElement.getContext("2d");

    // this.boidList.push(new Boid(100, 100));

    this.resizeCanvas()

    // spawn 10 boids centered in the canvas with a random position away from the center ( not too far )
    this.spawnBoids(100);
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
    this.boidList.forEach(boid => this.drawBoid(boid));
  }

  drawBoid(boid: Boid) {
    this.ctx.save()

    this.ctx.translate(boid.pos.x, boid.pos.y);
    this.ctx.rotate(boid.heading);

    this.ctx.beginPath();
    this.ctx.moveTo(0, -10);
    this.ctx.lineTo(7, 10);
    this.ctx.lineTo(-7, 10);
    this.ctx.lineTo(0, -10);
    this.ctx.fillStyle = "white";
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.restore();
  }

  spawnBoids(boidCount: number, boidSpawnRange : number = -1, spawnCenter : coordinate = {x: this.ctx.canvas.width/2, y: this.ctx.canvas.height/2}) {
    let boidSpawnRangeX;
    let boidSpawnRangeY;
    if (boidSpawnRange === -1) {
      boidSpawnRangeX = this.ctx.canvas.width-80;
      boidSpawnRangeY = this.ctx.canvas.height-80;
    } else {
      boidSpawnRangeX = boidSpawnRange;
      boidSpawnRangeY = boidSpawnRange;
    }
    for (let i = 0; i < boidCount; i++) {
      const x = spawnCenter.x + Math.random() * boidSpawnRangeX - boidSpawnRangeX/2;
      const y = spawnCenter.y + Math.random() * boidSpawnRangeY - boidSpawnRangeY/2;
      this.boidList.push(new Boid(x, y));
    }
  }

  computeBoids() {
    const margin = 80;

    this.boidList.forEach(boid => {
      // get distance from each boid to each other boid store in a 2d array distances[][] where first index is the boid index and second index is the other boid index
      let distances: number[][] = [];
      this.boidList.forEach((boid2, index) => {
        distances.push([]);
        this.boidList.forEach((boid3, index2) => {
          distances[index].push(Math.sqrt((boid2.pos.x - boid3.pos.x) ** 2 + (boid2.pos.y - boid3.pos.y) ** 2));
        });
      });

      boid.computePosition(this.boidList, distances, this.boidList.indexOf(boid), {left: 0 + margin, right: this.ctx.canvas.width - margin, top: 0 + margin, bottom: this.ctx.canvas.height - margin});
    });

    this.updateCanvas();
  }
}
