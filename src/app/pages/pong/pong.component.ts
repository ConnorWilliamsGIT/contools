import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {LayoutComponent} from "../../components/layout/layout.component";
import {Ball} from "../../models/ball.class";
import {coordinate} from "../../models/coordinate.type";
import {NavbarComponent} from "../../components/navbar/navbar.component";

@Component({
  selector: 'app-pong',
  standalone: true,
  imports: [
    LayoutComponent,
    NavbarComponent
  ],
  templateUrl: './pong.component.html',
  styleUrl: './pong.component.scss'
})

export class PongComponent implements AfterViewInit {
  @ViewChild("canvas") canvas?: ElementRef;
  @ViewChild("canvasFrame") canvasFrame?: ElementRef;

  private pressedKeys: Set<string> = new Set();

  private ctx: any;
  private ball: Ball = new Ball(0, 0);
  private timeLoop: any;
  private p1Handle: coordinate = {x: 0, y: 0};
  private p2Handle: coordinate = {x: 0, y: 0};

  private expectedBounce: number = 1;

  private handleDimDefault: coordinate = {x: 20, y: 200};

  private handleWidth = this.handleDimDefault.x;
  private handleHeight = this.handleDimDefault.y;

  private score: number[] = [0, 0];

  private paused: boolean = true;

  ngAfterViewInit(): void {
    if (this.canvas === undefined || this.canvasFrame === undefined) {
      console.log("Canvas not found");
      return;
    }
    this.ctx = this.canvas.nativeElement.getContext("2d");

    this.resizeCanvas()

    this.ball = new Ball(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);

    if (this.ball.vel.x > 0) {
      this.expectedBounce = 2;
    } else {
      this.expectedBounce = 1;
    }

    this.timeLoop = setInterval(() => this.computePositions(), 1000 / 60);

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

    this.p1Handle = {x: this.ctx.canvas.width / 10, y: this.ctx.canvas.height / 2};
    this.p2Handle = {x: this.ctx.canvas.width * 9 / 10, y: this.ctx.canvas.height / 2};

    this.handleWidth = this.handleDimDefault.x;
    this.handleHeight = this.ctx.canvas.height / 5;

    this.updateCanvas();
  }


  updateCanvas() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ball.draw(this.ctx);

    this.drawField();

    if (this.paused) {
      this.ctx.font = "30px pixelon";
      this.ctx.fillStyle = "white";
      this.ctx.textAlign = "center";
      this.ctx.fillText("Paused", this.ctx.canvas.width / 2, this.ctx.canvas.height * 4 / 5);

      this.ctx.font = "15px pixelon";
      this.ctx.fillText("Press Space to resume", this.ctx.canvas.width / 2, this.ctx.canvas.height * 4 / 5 + 30);

      this.ctx.font = "15px pixelon";
      this.ctx.fillText("Press R to restart", this.ctx.canvas.width / 2, this.ctx.canvas.height * 4 / 5 + 50);

      // show player controls
      this.ctx.font = "15px pixelon";
      this.ctx.fillText("Player 1: up: W, down: S", this.ctx.canvas.width * 3 / 10, this.ctx.canvas.height * 4 / 5 + 70);
      this.ctx.fillText("Player 2: up: O, down: L", this.ctx.canvas.width * 7 / 10, this.ctx.canvas.height * 4 / 5 + 70);
    }

    this.ctx.font = "30px pixelon";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.fillText(this.score[0].toString(), this.ctx.canvas.width * 9 / 20, this.ctx.canvas.height / 10);
    this.ctx.fillText(this.score[1].toString(), this.ctx.canvas.width * 11 / 20, this.ctx.canvas.height / 10);

    this.drawHandle(this.p1Handle);
    this.drawHandle(this.p2Handle);
  }

  drawField() {
    let centerRadius = 100;
    let lineWidth = 3;

    this.ctx.beginPath();
    this.ctx.arc(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2, centerRadius, 0, Math.PI * 2, false);
    this.ctx.arc(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2, centerRadius - lineWidth, 0, Math.PI * 2, true);
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.moveTo(this.ctx.canvas.width / 2, 0);
    this.ctx.lineTo(this.ctx.canvas.width / 2, this.ctx.canvas.height);
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    this.ctx.lineWidth = lineWidth;
    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawHandle(handle: coordinate) {


    this.ctx.beginPath();
    this.ctx.rect(handle.x - this.handleWidth / 2, handle.y - this.handleHeight / 2, this.handleWidth, this.handleHeight);
    this.ctx.fillStyle = "white";
    this.ctx.fill();
    this.ctx.closePath();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let keyPressed = event.key;
    if (keyPressed === "r") {
      this.restart(true);
    }
    if (keyPressed === " ") {
      this.togglePause();
    }
    this.pressedKeys.add(event.key);
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    this.pressedKeys.delete(event.key);
  }

  isKeyDown(key: string): boolean {
    return this.pressedKeys.has(key);
  }

  restart(fullRestart: boolean = false) {
    this.paused = true;
    this.ball.setPos(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    this.ball.setRandomVel();
    if (this.ball.vel.x > 0) {
      this.expectedBounce = 2;
    } else {
      this.expectedBounce = 1;
    }
    if (fullRestart) {
      this.score = [0, 0];
    }
    this.updateCanvas();
  }

  togglePause() {
    this.paused = !this.paused;
  }

  scorePoint(player: number) {
    this.restart();
    this.score[player]++;
  }

  computePositions() {
    const handleSpeed = 5;

    if (this.isKeyDown("w")) {
      this.p1Handle.y -= handleSpeed;
    }
    if (this.isKeyDown("s")) {
      this.p1Handle.y += handleSpeed;
    }
    if (this.isKeyDown("o")) {
      this.p2Handle.y -= handleSpeed;
    }
    if (this.isKeyDown("l")) {
      this.p2Handle.y += handleSpeed;
    }

    if (this.p1Handle.y < this.handleHeight / 2) {
      this.p1Handle.y = this.handleHeight / 2;
    }
    if (this.p1Handle.y > this.ctx.canvas.height - this.handleHeight / 2) {
      this.p1Handle.y = this.ctx.canvas.height - this.handleHeight / 2;
    }
    if (this.p2Handle.y < this.handleHeight / 2) {
      this.p2Handle.y = this.handleHeight / 2;
    }
    if (this.p2Handle.y > this.ctx.canvas.height - this.handleHeight / 2) {
      this.p2Handle.y = this.ctx.canvas.height - this.handleHeight / 2;
    }

    if (!this.paused) {
      this.computeBallPosition();
    }

    this.updateCanvas();
  }

  computeBallPosition() {
    const coyoteWidth = 10;

    if (this.ball.pos.x + this.ball.radius < 0 || this.ball.pos.x - this.ball.radius > this.ctx.canvas.width) {
      this.ball.setPos(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    }

    if (this.ball.pos.x + this.ball.radius > this.ctx.canvas.width) {
      this.scorePoint(0);
      return;
    }
    if (this.ball.pos.x - this.ball.radius < 0) {
      this.scorePoint(1);
      return;
    }

    if ((this.ball.pos.y + this.ball.radius) > this.ctx.canvas.height || (this.ball.pos.y - this.ball.radius) < 0) {
      this.ball.vel.y *= -1;
    }

    if (this.expectedBounce == 1 && this.ball.pos.x - this.ball.radius < this.p1Handle.x + 10 && this.ball.pos.x - this.ball.radius > this.p1Handle.x - 10 && this.ball.pos.y + this.ball.radius > this.p1Handle.y - 50 - coyoteWidth && this.ball.pos.y - this.ball.radius < this.p1Handle.y + 50 + coyoteWidth) {
      this.ball.vel.x *= -1;
      this.expectedBounce = 2;
    }
    if (this.expectedBounce == 2 && this.ball.pos.x + this.ball.radius > this.p2Handle.x - 10 && this.ball.pos.x + this.ball.radius < this.p2Handle.x + 10 && this.ball.pos.y + this.ball.radius > this.p2Handle.y - 50 - coyoteWidth && this.ball.pos.y - this.ball.radius < this.p2Handle.y + 50 + coyoteWidth) {
      this.ball.vel.x *= -1;
      this.expectedBounce = 1;
    }

    this.ball.update();
  }
}
