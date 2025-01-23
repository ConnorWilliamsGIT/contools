import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  HostListener,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
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
  @ViewChild("deleteButton") deleteButton?: ElementRef;
  @ViewChild("resetButton") resetButton?: ElementRef;

  buttonHovered: boolean = false;
  private ctx: any;
  private nodeRadius: number = 15;
  private nodeList: Node[] = [];
  private graphList: WritableSignal<graph[]> = signal([]);
  graphString = computed(() => {
    console.log('updated graph string')
    return this.graphsToString(this.graphList());
  });
  private drawingEdge: boolean = false;
  private tempEdgeSource: Node = new Node(0, 0);
  private tempEdgeEnd: Node = new Node(0, 0);
  // enum for different editing modes
  private Mode = {
    DEFAULT: Symbol("default"),
    DELETE: Symbol("delete"),
    MOVE: Symbol("move")
  };
  private current_mode: symbol = this.Mode.DEFAULT;

  isButtonHovered(hovered: boolean) {
    this.buttonHovered = hovered;
  }

  // Signals example
  // test = signal(2);
  // ifTrue = computed(() => {
  //   console.log('updated')
  //   return this.test() === 2
  // });

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
      x: coord.x - this.canvasFrame?.nativeElement.offsetLeft,
      y: coord.y - this.canvasFrame?.nativeElement.offsetTop
    }
  }

  drawNode(node: Node, colour: string = "white") {
    this.ctx.beginPath();
    this.ctx.arc(node.x, node.y, this.nodeRadius, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fillStyle = colour;
    this.ctx.fill();
  }

  getNodeDistance(node1: Node, node2: Node): number {
    return Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2));
  }

  drawSelectNode(node: Node) {
    // calculate angle at which the tempEdgeEnd is from the node
    let gap = 0.4 * Math.PI
    let thickness = this.nodeRadius * 0.2;
    let outerRadius = this.nodeRadius * 1.4;
    const angle = Math.atan2(this.tempEdgeEnd.y - node.y, this.tempEdgeEnd.x - node.x);
    if (this.getNodeDistance(node, this.tempEdgeEnd) < outerRadius) {
      gap = 0;
    }
    let angle_offset = angle + gap / 2;
    this.ctx.beginPath();
    this.ctx.arc(node.x, node.y, outerRadius, angle_offset, 2 * Math.PI - gap + angle_offset, false);
    this.ctx.arc(node.x, node.y, outerRadius - thickness, 2 * Math.PI - gap + angle_offset, angle_offset, true);
    this.ctx.closePath();
    this.ctx.fillStyle = "lightblue";
    this.ctx.fill();
  }

  drawEdge(start: Node, end: Node) {
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.closePath();
    this.ctx.strokeStyle = "white"
    this.ctx.stroke();
  }

  updateCanvas() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    if (this.current_mode === this.Mode.DELETE) {
      this.ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
      // fill background red low opacity
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    }

    this.graphList().forEach((graph) => this.drawGraph(graph));
    if (this.drawingEdge) {
      this.drawSelectNode(this.tempEdgeSource);
    }
  }

  drawGraph(graph: graph) {
    graph.nodes.forEach((node) => {
      this.drawNode(node);
      node.adjacentNodes.forEach((adjNode) => this.drawEdge(node, adjNode));
    });
  }


  checkSpace(coordinate: coordinate): { occupied: boolean, node: Node } {
    for (let i = 0; i < this.graphList().length; i++) {
      const graph = this.graphList()[i];
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

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let keyPressed = event.key;
    if (keyPressed === "r") {
      this.resetGraphs();
    }
    if (keyPressed === "x") {
      this.toggleDeleteMode();
    }
  }

  resetGraphs() {
    this.nodeList = [];
    this.graphList.set([]);
    this.updateCanvas();
    // reset button play clicked animation

  }

  toggleDeleteMode() {
    if (this.current_mode === this.Mode.DELETE) {
      this.current_mode = this.Mode.DEFAULT;
      this.deleteButton?.nativeElement.classList.remove("btn-error");
      this.deleteButton?.nativeElement.classList.add("opacity-50");
      this.deleteButton?.nativeElement.classList.remove("opacity-100");
    } else {
      this.current_mode = this.Mode.DELETE;
      this.deleteButton?.nativeElement.classList.add("btn-error");
      this.deleteButton?.nativeElement.classList.remove("opacity-50");
      this.deleteButton?.nativeElement.classList.add("opacity-100");
    }
    this.updateCanvas();
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
    if (coordinate.x < 0 || coordinate.y < 0 || coordinate.x > this.ctx.canvas.width || coordinate.y > this.ctx.canvas.height || this.buttonHovered) {
      this.drawingEdge = false;
      this.updateCanvas();
      return;
    }
    const nodeCheck = this.checkSpace(coordinate);
    if (this.current_mode === this.Mode.DELETE) {
      if (nodeCheck.occupied) {
        this.nodeList = this.nodeList.filter((node) => node !== nodeCheck.node);
        // remove each occurrence of node from adjacent nodes
        this.nodeList.forEach((node) => node.removeAdjacentNode(nodeCheck.node));
        this.createGraphs();
      }
    } else {
      if (!nodeCheck.occupied && !this.drawingEdge) {                 // clicked on empty space, no edge drawing
        this.nodeList.push(new Node(coordinate.x, coordinate.y));
        this.graphList.update(arr => {
          return [...arr, {nodes: [this.nodeList[this.nodeList.length - 1]]}]
        });

      } else if (nodeCheck.occupied && !this.drawingEdge) {           // clicked on node, no edge drawing
        this.drawingEdge = true;
        this.tempEdgeSource = nodeCheck.node;
        this.tempEdgeEnd.setCoordinate(coordinate);
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
    }
    this.updateCanvas();
  }

  createGraphs() {
    this.nodeList.forEach((node) => node.visited = false);
    this.graphList.set([]);

    for (let i = 0; i < this.nodeList.length; i++) {
      const node = this.nodeList[i];
      if (!node.visited) {
        const graph = {nodes: []};
        this.graphList().push(graph);
        this.visitNode(node, graph);
      }
    }

    console.log(this.graphList());
  }

  graphsToString(graphs: graph[]): string {
    let graphsString = "";
    for (let i = 0; i < graphs.length; i++) {
      graphsString += "Graph " + (i + 1) + "\n";
      graphsString += this.graphToString(graphs[i]);
      graphsString += "\n\n";
    }
    return graphsString
  }

  graphToString(graph: graph): string {
    let graphString = "";
    for (let i = 0; i < graph.nodes.length; i++) {
      graphString += graph.nodes[i].id;
      graphString += " -> ";
      for (let j = 0; j < graph.nodes[i].adjacentNodes.length; j++) {
        graphString += graph.nodes[i].adjacentNodes[j].id;
        graphString += " ";
      }
      graphString += "\n";
    }
    graphString += "\n";
    return graphString;
  }

  visitNode(node: Node, graph: graph, id: number = 0) {
    if (node.visited) {
      return;
    }

    graph.nodes.push(node);
    node.setId(id);
    node.visited = true;
    for (let i = 0; i < node.adjacentNodes.length; i++) {
      this.visitNode(node.adjacentNodes[i], graph, ++id);
    }
  }
}
