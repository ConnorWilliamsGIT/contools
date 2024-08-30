import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {RouterLink} from "@angular/router";
import {LayoutComponent} from "../../components/layout/layout.component";
import {Node} from "../../models/node.class";
import {coordinate} from "../../models/coordinate.type";

type graph = { nodes: Node[] }

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
  private nodeList: Node[] = [];
  private graphList: graph[] = [];
  private drawingEdge: boolean = false;
  private tempEdgeSource: Node = new Node(0, 0);
  private tempEdgeEnd: Node = new Node(0, 0);

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

  pageToCanvasPos(coord: coordinate): coordinate {
    return {
      x: coord.x - this.canvas?.nativeElement.offsetLeft,
      y: coord.y - this.canvas?.nativeElement.offsetTop
    }
  }

  drawNode(node: Node) {
    this.ctx.beginPath();
    this.ctx.arc(node.x, node.y, this.nodeRadius, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawEdge(start: Node, end: Node) {
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  updateCanvas() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.graphList.forEach((graph) => this.drawGraph(graph));
  }

  drawGraph(graph: graph) {
    graph.nodes.forEach((node) => {
      this.drawNode(node);
      node.adjacentNodes.forEach((adjNode) => this.drawEdge(node, adjNode));
    });
  }


  checkSpace(coordinate: coordinate): { occupied: boolean, node: Node } {
    for (let i = 0; i < this.graphList.length; i++) {
      const graph = this.graphList[i];
      for (let j = 0; j < graph.nodes.length; j++) {
        const currentNode = graph.nodes[j];
        const distance = Math.sqrt(Math.pow(coordinate.x - currentNode.x, 2) + Math.pow(coordinate.y - currentNode.y, 2));
        if (distance < this.nodeRadius * 2) {
          return {occupied: true, node: currentNode};
        }
      }
    }

    return {occupied: false, node: new Node(0, 0)};
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    if (this.drawingEdge) {
      this.updateCanvas();
      this.tempEdgeEnd.setCoordinate(this.pageToCanvasPos({x: event.pageX, y: event.pageY}));
      this.drawEdge(this.tempEdgeSource, this.tempEdgeEnd);
    }
  }

  // add click listener
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    const coordinate: coordinate = this.pageToCanvasPos({x: event.pageX, y: event.pageY});
    const nodeCheck = this.checkSpace(coordinate);
    if (!nodeCheck.occupied && !this.drawingEdge) {                 // clicked on empty space, no edge drawing
      this.nodeList.push(new Node(coordinate.x, coordinate.y));
      this.graphList.push({nodes: [this.nodeList[this.nodeList.length - 1]]});
    } else if (nodeCheck.occupied && !this.drawingEdge) {           // clicked on node, no edge drawing
      this.drawingEdge = true;
      this.tempEdgeSource = nodeCheck.node;
    } else if (nodeCheck.occupied && this.drawingEdge) {            // clicked on node, while edge drawing
      this.drawingEdge = false;
      if (nodeCheck.node != this.tempEdgeSource && !this.tempEdgeSource.isAdjacent(nodeCheck.node)) {
        // Node edge successfully created
        this.tempEdgeSource.addAdjacentNode(nodeCheck.node);
        nodeCheck.node.addAdjacentNode(this.tempEdgeSource);
        this.createGraphs();
      }
    } else if (!nodeCheck.occupied && this.drawingEdge) {           // clicked on empty space, while edge drawing
      this.drawingEdge = false;
    }
    this.updateCanvas();
  }

  createGraphs() {
    this.nodeList.forEach((node) => node.visited = false);
    this.graphList = [];

    for (let i = 0; i < this.nodeList.length; i++) {
      const node = this.nodeList[i];
      if (!node.visited) {
        const graph = {nodes: []};
        this.graphList.push(graph);
        this.visitNode(node, graph);
      }
    }

    console.log(this.graphList);
  }

  visitNode(node: Node, graph: graph) {
    if (node.visited) {
      return;
    }

    graph.nodes.push(node);
    node.visited = true;
    for (let i = 0; i < node.adjacentNodes.length; i++) {
      this.visitNode(node.adjacentNodes[i], graph);
    }
  }
}
