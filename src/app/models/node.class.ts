import {coordinate} from './coordinate.type';

export class Node {
  public x: number = 0;
  public y: number = 0;
  public adjacentNodes: Node[] = [];
  public visited: boolean = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  // getter for visited
  get isVisited(): boolean {
    return this.visited;
  }

  setCoordinate(coordinate: coordinate) {
    this.x = coordinate.x;
    this.y = coordinate.y;
  }

  addAdjacentNode(node: Node) {
    this.adjacentNodes.push(node);
  }

  removeAdjacentNode(node: Node) {
    this.adjacentNodes = this.adjacentNodes.filter((adjNode) => adjNode !== node);
  }

  isAdjacent(node: Node): boolean {
    return this.adjacentNodes.includes(node);
  }
}
