import{a as y}from"./chunk-CM2OOQAF.js";import{a as p,b as f,c as u,d as g,e as m,f as v,i as h,j as r,k as c,l as w,m as x}from"./chunk-FX43OOOG.js";var o=class{constructor(s,l){this.x=0,this.y=0,this.adjacentNodes=[],this.visited=!1,this.x=s,this.y=l}get isVisited(){return this.visited}setCoordinate(s){this.x=s.x,this.y=s.y}addAdjacentNode(s){this.adjacentNodes.push(s)}removeAdjacentNode(s){this.adjacentNodes=this.adjacentNodes.filter(l=>l!==s)}isAdjacent(s){return this.adjacentNodes.includes(s)}};var E=["canvas"],C=["canvasFrame"],N=["image"],k=(()=>{let s=class s{constructor(){this.nodeRadius=15,this.nodeList=[],this.graphList=[],this.drawingEdge=!1,this.tempEdgeSource=new o(0,0),this.tempEdgeEnd=new o(0,0)}ngAfterViewInit(){if(this.canvas===void 0||this.canvasFrame===void 0){console.log("Canvas not found");return}this.ctx=this.canvas.nativeElement.getContext("2d"),this.resizeCanvas()}resizeCanvas(){if(this.canvas===void 0||this.canvasFrame===void 0){console.log("Canvas not found");return}let e=this.canvasFrame.nativeElement;this.ctx.canvas.width=e.clientWidth,this.ctx.canvas.height=e.clientHeight,this.updateCanvas()}renderImage(){let e=new Image;e.onload=()=>{let t=(this.ctx.canvas.width-e.width*.3)/2,i=(this.ctx.canvas.height-e.height*.3)/2;this.ctx.drawImage(e,t,i,e.width*.3,e.height*.3)},e.src="https://media.licdn.com/dms/image/D5603AQHNteNbj0wR1w/profile-displayphoto-shrink_800_800/0/1705715328463?e=1715212800&v=beta&t=wVcIyNOl3h_1b_FK7aloU_aWNC7fHl9UrdbQhSdj1XU"}pageToCanvasPos(e){return{x:e.x-this.canvas?.nativeElement.offsetLeft,y:e.y-this.canvas?.nativeElement.offsetTop}}drawNode(e){this.ctx.beginPath(),this.ctx.arc(e.x,e.y,this.nodeRadius,0,2*Math.PI),this.ctx.closePath(),this.ctx.fillStyle="white",this.ctx.fill()}drawEdge(e,t){this.ctx.lineWidth=4,this.ctx.beginPath(),this.ctx.moveTo(e.x,e.y),this.ctx.lineTo(t.x,t.y),this.ctx.closePath(),this.ctx.strokeStyle="white",this.ctx.stroke()}updateCanvas(){this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height),this.graphList.forEach(e=>this.drawGraph(e))}drawGraph(e){e.nodes.forEach(t=>{this.drawNode(t),t.adjacentNodes.forEach(i=>this.drawEdge(t,i))})}checkSpace(e){for(let t=0;t<this.graphList.length;t++){let i=this.graphList[t];for(let n=0;n<i.nodes.length;n++){let a=i.nodes[n];if(Math.sqrt(Math.pow(e.x-a.x,2)+Math.pow(e.y-a.y,2))<this.nodeRadius*2)return{occupied:!0,node:a}}}return{occupied:!1,node:new o(0,0)}}onMousemove(e){this.drawingEdge&&(this.updateCanvas(),this.tempEdgeEnd.setCoordinate(this.pageToCanvasPos({x:e.pageX,y:e.pageY})),this.drawEdge(this.tempEdgeSource,this.tempEdgeEnd))}onClick(e){let t=this.pageToCanvasPos({x:e.pageX,y:e.pageY});if(t.x<0||t.y<0||t.x>this.ctx.canvas.width||t.y>this.ctx.canvas.height){this.drawingEdge=!1,this.updateCanvas();return}let i=this.checkSpace(t);!i.occupied&&!this.drawingEdge?(this.nodeList.push(new o(t.x,t.y)),this.graphList.push({nodes:[this.nodeList[this.nodeList.length-1]]})):i.occupied&&!this.drawingEdge?(this.drawingEdge=!0,this.tempEdgeSource=i.node):i.occupied&&this.drawingEdge?(this.drawingEdge=!1,i.node!=this.tempEdgeSource&&!this.tempEdgeSource.isAdjacent(i.node)&&(this.tempEdgeSource.addAdjacentNode(i.node),i.node.addAdjacentNode(this.tempEdgeSource),this.createGraphs())):!i.occupied&&this.drawingEdge&&(this.drawingEdge=!1),this.updateCanvas()}createGraphs(){this.nodeList.forEach(e=>e.visited=!1),this.graphList=[];for(let e=0;e<this.nodeList.length;e++){let t=this.nodeList[e];if(!t.visited){let i={nodes:[]};this.graphList.push(i),this.visitNode(t,i)}}console.log(this.graphList)}visitNode(e,t){if(!e.visited){t.nodes.push(e),e.visited=!0;for(let i=0;i<e.adjacentNodes.length;i++)this.visitNode(e.adjacentNodes[i],t)}}};s.\u0275fac=function(t){return new(t||s)},s.\u0275cmp=p({type:s,selectors:[["app-home"]],viewQuery:function(t,i){if(t&1&&(h(E,5),h(C,5),h(N,5)),t&2){let n;r(n=c())&&(i.canvas=n.first),r(n=c())&&(i.canvasFrame=n.first),r(n=c())&&(i.image=n.first)}},hostBindings:function(t,i){t&1&&v("resize",function(){return i.resizeCanvas()},!1,f)("mousemove",function(a){return i.onMousemove(a)})("click",function(a){return i.onClick(a)})},standalone:!0,features:[x],decls:7,vars:0,consts:[["settings","",2,"user-select","none"],["canvas","",1,"w-full","h-full"],["canvasFrame",""],["canvas",""]],template:function(t,i){t&1&&(u(0,"app-layout")(1,"div",0),w(2," Graph "),g(),u(3,"div",1,2),m(5,"canvas",null,3),g()())},dependencies:[y]});let d=s;return d})();export{k as HomeComponent};
