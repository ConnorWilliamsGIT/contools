import {coordinate} from './coordinate.type';

export class Node {
  public x: number = 0;
  public y: number = 0;
  public adjacentNodes: Node[] = [];
  public visited: boolean = false;
  public id = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  // getter for visited
  get isVisited(): boolean {
    return this.visited;
  }

  // getter for id
  get getId(): number {
    return this.id;
  }

  // setter for visited
  setVisited(visited: boolean) {
    this.visited = visited;
  }

  // setter for id
  setId(id: number) {
    this.id = id;
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
