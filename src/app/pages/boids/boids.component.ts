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
  private sharkCount: number = 1;
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

  private showBoidTrail: boolean = false;
  private boidTrailLength: number = 50;
  private boidTrail: Map<Boid, coordinate[]> = new Map();

  private shiftPressed: boolean = false;

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

    this.testBoid.settings.visualRange *= this.boidScale;
    this.testBoid.settings.protectedRange *= this.boidScale;


    // this.gridLists = new Array(Math.ceil(this.ctx.canvas.width / (2 * this.testBoid.visualRange))).fill([]).map(() => new Array(Math.ceil(this.ctx.canvas.height / (2 * this.testBoid.visualRange))).fill([])); //new Array(Math.ceil(this.ctx.canvas.height / (2 * this.testBoid.visualRange))).fill([])
    this.gridLists = Array.from({length: Math.ceil(this.ctx.canvas.width / (2 * this.testBoid.settings.visualRange))}, () =>
      Array.from({length: Math.ceil(this.ctx.canvas.height / (2 * this.testBoid.settings.visualRange))}, () => [])
    );
    // spawn 10 boids centered in the canvas with a random position away from the center ( not too far )
    this.spawnBoids(this.boidCount, 'boid');
    this.spawnBoids(this.sharkCount, 'shark');
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

    if (this.showBoidTrail) {
      this.drawTrail();
    }
  }

  drawTrail() {
    this.boidTrail.forEach((trail, boid) => {
        this.ctx.beginPath();
        this.ctx.moveTo(trail[0].x, trail[0].y);
        trail.forEach((coord) => {
          this.ctx.lineTo(coord.x, coord.y);
        });
        this.ctx.strokeStyle = boid.settings.colour;
        this.ctx.stroke();
      });
  }

  drawGrid() {
    this.gridLists.forEach((row, xIndex) => {
      row.forEach((cell, yIndex) => {
        if ((xIndex + yIndex) % 2 === 0) {
          this.ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
        } else {
          this.ctx.fillStyle = "rgba(255, 0, 0, 0)";
        }
        this.ctx.fillRect(xIndex * 2 * this.testBoid.settings.visualRange, yIndex * 2 * this.testBoid.settings.visualRange, 2 * this.testBoid.settings.visualRange, 2 * this.testBoid.settings.visualRange);
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
    this.ctx.fillStyle = boid.settings.colour;
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.restore();

    // draw circle around boid at boid visual range with a hole in the middle for the boid avoid range
    if (this.showBoidRange) {
      this.ctx.beginPath();
      this.ctx.arc(boid.pos.x, boid.pos.y, boid.settings.visualRange, 0, 2 * Math.PI, false);
      this.ctx.arc(boid.pos.x, boid.pos.y, boid.settings.protectedRange, 2 * Math.PI, 0, true);
      this.ctx.closePath();
      if (boid.boidType === 'shark') {
        this.ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
      } else {
      this.ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      }
      this.ctx.fill();
    }
  }

  spawnBoids(boidCount: number, boidType: string, boidSpawnRange: number = -1, spawnCenter: coordinate = {
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
      this.boidList.push(new Boid(x, y, boidType));
      if (boidType === 'shark') {
        this.boidList[this.boidList.length - 1].settings.turnFactor *= 2;
      }
      this.boidList[this.boidList.length - 1].settings.visualRange *= this.boidScale;
      this.boidList[this.boidList.length - 1].settings.protectedRange *= this.boidScale;
      this.boidList[this.boidList.length - 1].settings.maxSpeed *= this.boidScale;
      this.boidList[this.boidList.length - 1].settings.minSpeed *= this.boidScale;
      this.gridLists[this.boidList[this.boidList.length - 1].xIndex][this.boidList[this.boidList.length - 1].yIndex].push(this.boidList[this.boidList.length - 1]);
      // this.boidList[this.boidList.length - 1].settings.colour = "rgba(" + Math.floor(255*(this.boidList[this.boidList.length - 1].xIndex/this.gridLists.length)) + ", " + Math.floor(255*(this.boidList[this.boidList.length - 1].yIndex/this.gridLists[0].length)) + ", 0, 1)";
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let keyPressed = event.key;
    console.log(keyPressed);
    if (keyPressed === " ") {
      this.toggleTime();
    }
    if (keyPressed === "x") {
      this.computeBoids();
    }
    if (keyPressed === "g") {
      this.showGrid = !this.showGrid;
    }
    if (keyPressed === "r") {
      this.showBoidRange = !this.showBoidRange;
    }
    if (keyPressed === "t") {
      this.showBoidTrail = !this.showBoidTrail;
    }
    if (keyPressed === "ArrowUp") {
      if (event.getModifierState("Control")) {
        this.boidTrailLength += 50;
      } else if (event.getModifierState("Alt") && event.getModifierState("Shift")) {
        this.spawnBoids(50, 'shark');
      } else if (event.getModifierState("Alt")) {
        this.spawnBoids(1, 'shark');
      } else if (event.getModifierState("Shift")) {
        this.spawnBoids(50, 'boid');
      } else {
        this.spawnBoids(1, 'boid');
      }
    }
    if (keyPressed === "ArrowDown") {
      if (event.getModifierState("Control")) {
        this.boidTrailLength -= 50;
        this.boidTrailLength = Math.max(this.boidTrailLength, 0);
      } else if (event.getModifierState("Alt") && event.getModifierState("Shift")) {
        this.removeBoid(50, 'shark');
      } else if (event.getModifierState("Alt")) {
        this.removeBoid(1, 'shark');
      } else if (event.getModifierState("Shift")) {
          this.removeBoid(50);
      } else if (this.boidList.length > 0) {
        this.removeBoid();
      }
    }
    this.updateCanvas();
  }

  removeBoid(numberOfBoids: number = 1, type: string = 'boid') {
    let count = 0;
    for (let i = this.boidList.length - 1; i >= 0; i--) {
      if (count >= numberOfBoids) {
        break;
      }

      if (this.boidList[i].boidType === type) {
        this.gridLists[this.boidList[i].xIndex][this.boidList[i].yIndex].filter((boid: Boid) => boid !== this.boidList[i]);
        this.boidTrail.delete(this.boidList[i]);
        this.boidList.splice(i, 1);
        count++;
      }
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
          if (this.gridLists[xIndex + i] == undefined || this.gridLists[xIndex + i][yIndex + j] == undefined) {
            continue;
          }

          this.gridLists[xIndex + i][yIndex + j].forEach((boid2: Boid) => {
            if (boid2 == boid) {
              return;
            }
            const distance = Math.sqrt((boid.pos.x - boid2.pos.x) ** 2 + (boid.pos.y - boid2.pos.y) ** 2);
            distances.get(boid)?.set(boid2, distance);
            if (distance < boid.settings.visualRange) {
              nearbyBoids.get(boid)?.push(boid2);
            }
          });
        }
      }
    });

    this.boidList.forEach(boid => {
        if (this.gridLists[boid.xIndex] && this.gridLists[boid.xIndex][boid.yIndex]) {
          this.gridLists[boid.xIndex][boid.yIndex] = this.gridLists[boid.xIndex][boid.yIndex].filter((boid2: Boid) => boid2 !== boid);
        }
        boid.computePosition(nearbyBoids.get(boid) || [], distances, {
        left: 0 + this.margin,
        right: this.ctx.canvas.width - this.margin,
        top: 0 + this.margin,
        bottom: this.ctx.canvas.height - this.margin
      });
      boid.xIndex = Math.floor(boid.pos.x / (2 * boid.settings.visualRange));
      boid.yIndex = Math.floor(boid.pos.y / (2 * boid.settings.visualRange));

      if (this.showBoidTrail) {
        if (!this.boidTrail.has(boid)) {
          this.boidTrail.set(boid, []);
        }
        this.boidTrail.get(boid)?.push({x: boid.pos.x, y: boid.pos.y});
        if (this.boidTrailLength == 0) {
          this.boidTrail.delete(boid);
        } else {
          while ((this.boidTrail.get(boid)?.length || 0) > this.boidTrailLength) {
            this.boidTrail.get(boid)?.shift();
          }
        }
      }

      if (this.gridLists[boid.xIndex] && this.gridLists[boid.xIndex][boid.yIndex]) {
        this.gridLists[boid.xIndex][boid.yIndex].push(boid);
      }
    });

    this.updateCanvas();
  }
}
