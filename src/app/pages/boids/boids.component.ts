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
  private boidCount: number = 500;
  private boidHeight: number = 7;
  private boidScale: number = 0.7;
  private boidList: Boid[] = [];
  private gridLists: any[][] = [];
  private testBoid: Boid = new Boid(0, 0);
  private timeLoop: any;
  private paused: boolean = false;
  private showGrid: boolean = false;
  private showBoidRange: boolean = false;
  private margin: number = 100;


  ngAfterViewInit(): void {
    if (this.canvas === undefined || this.canvasFrame === undefined) {
      console.log("Canvas not found");
      return;
    }

    this.ctx = this.canvas.nativeElement.getContext("2d");

    // this.boidList.push(new Boid(100, 100));

    this.resizeCanvas()

    if (!this.paused) {
      this.paused = true;
      this.toggleTime();
    }
    // this.gridLists = new Array(Math.ceil(this.ctx.canvas.width / (2 * this.testBoid.visualRange))).fill([]).map(() => new Array(Math.ceil(this.ctx.canvas.height / (2 * this.testBoid.visualRange))).fill([])); //new Array(Math.ceil(this.ctx.canvas.height / (2 * this.testBoid.visualRange))).fill([])
    this.gridLists = Array.from({length: Math.ceil(this.ctx.canvas.width / (2 * this.testBoid.visualRange))}, () =>
      Array.from({length: Math.ceil(this.ctx.canvas.height / (2 * this.testBoid.visualRange))}, () => [])
    );
    // spawn 10 boids centered in the canvas with a random position away from the center ( not too far )
    this.spawnBoids(this.boidCount);
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

  toggleTime() {
    if (this.paused) {
      this.timeLoop = setInterval(() => {
        this.computeBoids();
      }, 10)
      this.paused = false;
    } else {
      clearInterval(this.timeLoop);
      this.paused = true;
    }
  }

  updateCanvas() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.boidList.forEach(boid => this.drawBoid(boid));

    if (this.showGrid) {
      this.drawGrid();
    }
  }

  drawGrid() {
    this.gridLists.forEach((row, xIndex) => {
      row.forEach((cell, yIndex) => {
        if ((xIndex + yIndex) % 2 === 0) {
          this.ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
        } else {
          this.ctx.fillStyle = "rgba(255, 0, 0, 0)";
        }
        this.ctx.fillRect(xIndex * 2 * this.testBoid.visualRange, yIndex * 2 * this.testBoid.visualRange, 2 * this.testBoid.visualRange, 2 * this.testBoid.visualRange);
      });
    });
  }

  drawBoid(boid: Boid) {
    this.ctx.save()

    this.ctx.translate(boid.pos.x, boid.pos.y);
    this.ctx.rotate(boid.heading);

    this.ctx.beginPath();
    this.ctx.moveTo(0, -this.boidHeight * this.boidScale);
    this.ctx.lineTo(Math.round(this.boidHeight * this.boidScale * 0.7), this.boidHeight * this.boidScale);
    this.ctx.lineTo(-Math.round(this.boidHeight * this.boidScale * 0.7), this.boidHeight * this.boidScale);
    this.ctx.lineTo(0, -this.boidHeight * this.boidScale);
    this.ctx.fillStyle = "white";
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.restore();

    // draw circle around boid at boid visual range with a hole in the middle for the boid avoid range
    if (this.showBoidRange) {
      this.ctx.beginPath();
      this.ctx.arc(boid.pos.x, boid.pos.y, boid.visualRange, 0, 2 * Math.PI, false);
      this.ctx.arc(boid.pos.x, boid.pos.y, boid.protectedRange, 2 * Math.PI, 0, true);
      this.ctx.closePath();
      this.ctx.fillStyle = "rgba(200, 200, 255, 0.1)";
      this.ctx.fill();
    }
  }

  spawnBoids(boidCount: number, boidSpawnRange: number = -1, spawnCenter: coordinate = {
    x: this.ctx.canvas.width / 2,
    y: this.ctx.canvas.height / 2
  }) {
    let boidSpawnRangeX;
    let boidSpawnRangeY;
    if (boidSpawnRange === -1) {
      boidSpawnRangeX = this.ctx.canvas.width - 80;
      boidSpawnRangeY = this.ctx.canvas.height - 80;
    } else {
      boidSpawnRangeX = boidSpawnRange;
      boidSpawnRangeY = boidSpawnRange;
    }

    for (let i = 0; i < boidCount; i++) {
      const x = spawnCenter.x + Math.random() * boidSpawnRangeX - boidSpawnRangeX / 2;
      const y = spawnCenter.y + Math.random() * boidSpawnRangeY - boidSpawnRangeY / 2;
      this.boidList.push(new Boid(x, y));
      this.boidList[this.boidList.length - 1].visualRange *= this.boidScale;
      this.boidList[this.boidList.length - 1].protectedRange *= this.boidScale;
      this.boidList[this.boidList.length - 1].maxSpeed *= this.boidScale;
      this.boidList[this.boidList.length - 1].minSpeed *= this.boidScale;
      this.gridLists[this.boidList[this.boidList.length - 1].xIndex][this.boidList[this.boidList.length - 1].yIndex].push(this.boidList[this.boidList.length - 1]);
    }
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let keyPressed = event.key;
    if (keyPressed === " ") {
      this.toggleTime();
    }
    if (keyPressed === "x") {
      this.computeBoids();
    }
  }

  computeBoids() {
    let distances: Map<Boid, Map<Boid, number>> = new Map();
    let nearbyBoids: Map<Boid, Boid[]> = new Map();
    this.boidList.forEach((boid, index) => {
      distances.set(boid, new Map());
      nearbyBoids.set(boid, []);
      let xIndex = boid.xIndex;
      let yIndex = boid.yIndex;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (this.gridLists[xIndex + i] !== undefined && this.gridLists[xIndex + i][yIndex + j] !== undefined) {
            this.gridLists[xIndex + i][yIndex + j].forEach((boid2: Boid) => {
              if (boid2 !== boid) {
                const distance = Math.sqrt((boid.pos.x - boid2.pos.x) ** 2 + (boid.pos.y - boid2.pos.y) ** 2);
                distances.get(boid)?.set(boid2, distance);
                if (distance < boid.visualRange) {
                  nearbyBoids.get(boid)?.push(boid2);
                }
              }
            });
          }
        }
      }
    });
    this.boidList.forEach(boid => {
      boid.computePosition(nearbyBoids.get(boid) || [], distances, {
        left: 0 + this.margin,
        right: this.ctx.canvas.width - this.margin,
        top: 0 + this.margin,
        bottom: this.ctx.canvas.height - this.margin
      });

    });

    this.updateCanvas();
  }
}
