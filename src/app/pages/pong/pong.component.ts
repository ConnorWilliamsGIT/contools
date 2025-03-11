import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {LayoutComponent} from "../../components/layout/layout.component";
import {Ball} from "../../models/ball.class";

@Component({
  selector: 'app-pong',
  standalone: true,
  imports: [
    LayoutComponent
  ],
  templateUrl: './pong.component.html',
  styleUrl: './pong.component.scss'
})

export class PongComponent implements AfterViewInit {
  @ViewChild("canvas") canvas?: ElementRef;
  @ViewChild("canvasFrame") canvasFrame?: ElementRef;

  private ctx: any;
  private ball: Ball = new Ball(0, 0);
  private timeLoop: any;


  ngAfterViewInit(): void {
    if (this.canvas === undefined || this.canvasFrame === undefined) {
      console.log("Canvas not found");
      return;
    }

    this.ctx = this.canvas.nativeElement.getContext("2d");
    this.ball = new Ball(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);

    this.resizeCanvas()

    this.updateCanvas();

    this.timeLoop = setInterval(() => {
      this.computePositions();
    }, 10)
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
    this.ball.draw(this.ctx);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let keyPressed = event.key;
    if (keyPressed === " ") {
      this.restart();
    }
  }

  restart() {
    this.updateCanvas();
  }

  private computePositions() {
    if ((this.ball.pos.x + this.ball.radius) > this.ctx.canvas.width || (this.ball.pos.x - this.ball.radius) < 0) {
      this.ball.vel.x *= -1;
    }
    if ((this.ball.pos.y + this.ball.radius) > this.ctx.canvas.height || (this.ball.pos.y - this.ball.radius) < 0) {
      this.ball.vel.y *= -1;
    }
    console.log(this.ball.pos.x, this.ball.pos.y);
    this.ball.update();
    this.updateCanvas();
  }
}
