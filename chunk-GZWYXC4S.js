import"./chunk-LY2N474W.js";import{a as E}from"./chunk-VKBHE73N.js";import{Aa as f,Ba as v,Fa as h,Ga as r,Ha as c,Ia as w,Ja as x,O as p,ja as m,ya as l,za as g}from"./chunk-FRDNC4ZZ.js";var o=class{constructor(s,u){this.x=0,this.y=0,this.adjacentNodes=[],this.visited=!1,this.x=s,this.y=u}get isVisited(){return this.visited}setCoordinate(s){this.x=s.x,this.y=s.y}addAdjacentNode(s){this.adjacentNodes.push(s)}removeAdjacentNode(s){this.adjacentNodes=this.adjacentNodes.filter(u=>u!==s)}isAdjacent(s){return this.adjacentNodes.includes(s)}};var y=["canvas"],C=["canvasFrame"],N=["image"],k=(()=>{let s=class s{constructor(){this.nodeRadius=15,this.nodeList=[],this.graphList=[],this.drawingEdge=!1,this.tempEdgeSource=new o(0,0),this.tempEdgeEnd=new o(0,0)}ngAfterViewInit(){if(this.canvas===void 0||this.canvasFrame===void 0){console.log("Canvas not found");return}this.ctx=this.canvas.nativeElement.getContext("2d"),this.resizeCanvas()}resizeCanvas(){if(this.canvas===void 0||this.canvasFrame===void 0){console.log("Canvas not found");return}let e=this.canvasFrame.nativeElement;this.ctx.canvas.width=e.clientWidth,this.ctx.canvas.height=e.clientHeight,this.updateCanvas()}renderImage(){let e=new Image;e.onload=()=>{let i=(this.ctx.canvas.width-e.width*.3)/2,t=(this.ctx.canvas.height-e.height*.3)/2;this.ctx.drawImage(e,i,t,e.width*.3,e.height*.3)},e.src="https://media.licdn.com/dms/image/D5603AQHNteNbj0wR1w/profile-displayphoto-shrink_800_800/0/1705715328463?e=1715212800&v=beta&t=wVcIyNOl3h_1b_FK7aloU_aWNC7fHl9UrdbQhSdj1XU"}pageToCanvasPos(e){return{x:e.x-this.canvas?.nativeElement.offsetLeft,y:e.y-this.canvas?.nativeElement.offsetTop}}drawNode(e){this.ctx.beginPath(),this.ctx.arc(e.x,e.y,this.nodeRadius,0,2*Math.PI),this.ctx.closePath(),this.ctx.fill()}drawEdge(e,i){this.ctx.lineWidth=4,this.ctx.beginPath(),this.ctx.moveTo(e.x,e.y),this.ctx.lineTo(i.x,i.y),this.ctx.closePath(),this.ctx.stroke()}updateCanvas(){this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height),this.graphList.forEach(e=>this.drawGraph(e))}drawGraph(e){e.nodes.forEach(i=>{this.drawNode(i),i.adjacentNodes.forEach(t=>this.drawEdge(i,t))})}checkSpace(e){for(let i=0;i<this.graphList.length;i++){let t=this.graphList[i];for(let n=0;n<t.nodes.length;n++){let a=t.nodes[n];if(Math.sqrt(Math.pow(e.x-a.x,2)+Math.pow(e.y-a.y,2))<this.nodeRadius*2)return{occupied:!0,node:a}}}return{occupied:!1,node:new o(0,0)}}onMousemove(e){this.drawingEdge&&(this.updateCanvas(),this.tempEdgeEnd.setCoordinate(this.pageToCanvasPos({x:e.pageX,y:e.pageY})),this.drawEdge(this.tempEdgeSource,this.tempEdgeEnd))}onClick(e){let i=this.pageToCanvasPos({x:e.pageX,y:e.pageY}),t=this.checkSpace(i);!t.occupied&&!this.drawingEdge?(this.nodeList.push(new o(i.x,i.y)),this.graphList.push({nodes:[this.nodeList[this.nodeList.length-1]]})):t.occupied&&!this.drawingEdge?(this.drawingEdge=!0,this.tempEdgeSource=t.node):t.occupied&&this.drawingEdge?(this.drawingEdge=!1,t.node!=this.tempEdgeSource&&!this.tempEdgeSource.isAdjacent(t.node)&&(this.tempEdgeSource.addAdjacentNode(t.node),t.node.addAdjacentNode(this.tempEdgeSource),this.createGraphs())):!t.occupied&&this.drawingEdge&&(this.drawingEdge=!1),this.updateCanvas()}createGraphs(){this.nodeList.forEach(e=>e.visited=!1),this.graphList=[];for(let e=0;e<this.nodeList.length;e++){let i=this.nodeList[e];if(!i.visited){let t={nodes:[]};this.graphList.push(t),this.visitNode(i,t)}}console.log(this.graphList)}visitNode(e,i){if(!e.visited){i.nodes.push(e),e.visited=!0;for(let t=0;t<e.adjacentNodes.length;t++)this.visitNode(e.adjacentNodes[t],i)}}};s.\u0275fac=function(i){return new(i||s)},s.\u0275cmp=p({type:s,selectors:[["app-home"]],viewQuery:function(i,t){if(i&1&&(h(y,5),h(C,5),h(N,5)),i&2){let n;r(n=c())&&(t.canvas=n.first),r(n=c())&&(t.canvasFrame=n.first),r(n=c())&&(t.image=n.first)}},hostBindings:function(i,t){i&1&&v("resize",function(){return t.resizeCanvas()},!1,m)("mousemove",function(a){return t.onMousemove(a)})("click",function(a){return t.onClick(a)})},standalone:!0,features:[x],decls:7,vars:0,consts:[["settings","",2,"user-select","none"],["canvas","",1,"w-full","h-full"],["canvasFrame",""],["canvas",""]],template:function(i,t){i&1&&(l(0,"app-layout")(1,"div",0),w(2,"Graph"),g(),l(3,"div",1,2),f(5,"canvas",null,3),g()())},dependencies:[E]});let d=s;return d})();export{k as HomeComponent};
