import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {RouterLink} from "@angular/router";
import {LayoutComponent} from "../../components/layout/layout.component";

type coordinate = { x: number, y: number }

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    LayoutComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {
  @ViewChild("canvas") canvas?: ElementRef;
  @ViewChild("canvasFrame") canvasFrame?: ElementRef;
  @ViewChild("image") image?: ElementRef;

  private ctx: any;
  private nodeRadius: number = 15;
  private nodeList: coordinate[] = [];
  private edgeList: { start: coordinate, end: coordinate }[] = [];
  private drawingEdge: boolean = false;

  ngAfterViewInit(): void {
    if (this.canvas === undefined || this.canvasFrame === undefined) {
      console.log("Canvas not found");
      return;
    }

    this.ctx = this.canvas.nativeElement.getContext("2d");

    this.resizeCanvas()
    // this.renderImage()
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

  renderImage() {
    const img = new Image();
    img.onload = () => {

      const x = (this.ctx.canvas.width - img.width * 0.3) / 2;
      const y = (this.ctx.canvas.height - img.height * 0.3) / 2;

      this.ctx.drawImage(img, x, y, img.width * 0.3, img.height * 0.3);
    }
    img.src = "https://media.licdn.com/dms/image/D5603AQHNteNbj0wR1w/profile-displayphoto-shrink_800_800/0/1705715328463?e=1715212800&v=beta&t=wVcIyNOl3h_1b_FK7aloU_aWNC7fHl9UrdbQhSdj1XU";
  }

  pageToCanvasPos(x: number, y: number): coordinate {
    return {
      x: x - this.canvas?.nativeElement.offsetLeft,
      y: y - this.canvas?.nativeElement.offsetTop
    }
  }

  drawNode(x: number, y: number) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.nodeRadius, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawEdge(start: coordinate, end: coordinate) {
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  updateCanvas() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.nodeList.forEach((node) => this.drawNode(node.x, node.y));
    this.edgeList.forEach((edge) => this.drawEdge(edge.start, edge.end));
  }

  checkSpace(x: number, y: number): { occupied: boolean, node: coordinate } {
    for (let i = 0; i < this.nodeList.length; i++) {
      const node = this.nodeList[i];
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
      if (distance < this.nodeRadius * 2) {
        return {occupied: true, node: node};
      }
    }
    return {occupied: false, node: {x: 0, y: 0}};
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    if (this.drawingEdge) {
      this.edgeList[this.edgeList.length - 1].end = this.pageToCanvasPos(event.pageX, event.pageY);
      this.updateCanvas();
    }
  }

  // add click listener
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    const coordinate = this.pageToCanvasPos(event.pageX, event.pageY);
    const node_check = this.checkSpace(coordinate.x, coordinate.y);
    if (!node_check.occupied && !this.drawingEdge) {
      this.nodeList.push(coordinate);
      this.updateCanvas();
    } else if (node_check.occupied && !this.drawingEdge) {
      this.drawingEdge = true;
      this.edgeList.push({start: node_check.node, end: coordinate});
    } else if (node_check.occupied && this.drawingEdge) {
      this.drawingEdge = false;
      this.edgeList[this.edgeList.length - 1].end = node_check.node;
    }
    this.updateCanvas();
  }
}
