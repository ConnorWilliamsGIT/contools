import"./chunk-LY2N474W.js";import{a as w}from"./chunk-VKBHE73N.js";import{Aa as m,Ba as f,Fa as o,Ga as d,Ha as c,Ia as v,Ja as p,O as u,ja as g,ya as r,za as l}from"./chunk-FRDNC4ZZ.js";var x=["canvas"],y=["canvasFrame"],C=["image"],L=(()=>{let s=class s{constructor(){this.nodeRadius=15,this.nodeList=[],this.edgeList=[],this.drawingEdge=!1}ngAfterViewInit(){if(this.canvas===void 0||this.canvasFrame===void 0){console.log("Canvas not found");return}this.ctx=this.canvas.nativeElement.getContext("2d"),this.resizeCanvas()}resizeCanvas(){if(this.canvas===void 0||this.canvasFrame===void 0){console.log("Canvas not found");return}let e=this.canvasFrame.nativeElement;this.ctx.canvas.width=e.clientWidth,this.ctx.canvas.height=e.clientHeight,this.updateCanvas()}renderImage(){let e=new Image;e.onload=()=>{let t=(this.ctx.canvas.width-e.width*.3)/2,i=(this.ctx.canvas.height-e.height*.3)/2;this.ctx.drawImage(e,t,i,e.width*.3,e.height*.3)},e.src="https://media.licdn.com/dms/image/D5603AQHNteNbj0wR1w/profile-displayphoto-shrink_800_800/0/1705715328463?e=1715212800&v=beta&t=wVcIyNOl3h_1b_FK7aloU_aWNC7fHl9UrdbQhSdj1XU"}pageToCanvasPos(e,t){return{x:e-this.canvas?.nativeElement.offsetLeft,y:t-this.canvas?.nativeElement.offsetTop}}drawNode(e,t){this.ctx.beginPath(),this.ctx.arc(e,t,this.nodeRadius,0,2*Math.PI),this.ctx.closePath(),this.ctx.fill()}drawEdge(e,t){this.ctx.lineWidth=4,this.ctx.beginPath(),this.ctx.moveTo(e.x,e.y),this.ctx.lineTo(t.x,t.y),this.ctx.closePath(),this.ctx.stroke()}updateCanvas(){this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height),this.nodeList.forEach(e=>this.drawNode(e.x,e.y)),this.edgeList.forEach(e=>this.drawEdge(e.start,e.end))}checkSpace(e,t){for(let i=0;i<this.nodeList.length;i++){let n=this.nodeList[i];if(Math.sqrt(Math.pow(e-n.x,2)+Math.pow(t-n.y,2))<this.nodeRadius*2)return{occupied:!0,node:n}}return{occupied:!1,node:{x:0,y:0}}}onMousemove(e){this.drawingEdge&&(this.edgeList[this.edgeList.length-1].end=this.pageToCanvasPos(e.pageX,e.pageY),this.updateCanvas())}onClick(e){let t=this.pageToCanvasPos(e.pageX,e.pageY),i=this.checkSpace(t.x,t.y);!i.occupied&&!this.drawingEdge?(this.nodeList.push(t),this.updateCanvas()):i.occupied&&!this.drawingEdge?(this.drawingEdge=!0,this.edgeList.push({start:i.node,end:t})):i.occupied&&this.drawingEdge&&(this.drawingEdge=!1,this.edgeList[this.edgeList.length-1].end=i.node),this.updateCanvas()}};s.\u0275fac=function(t){return new(t||s)},s.\u0275cmp=u({type:s,selectors:[["app-home"]],viewQuery:function(t,i){if(t&1&&(o(x,5),o(y,5),o(C,5)),t&2){let n;d(n=c())&&(i.canvas=n.first),d(n=c())&&(i.canvasFrame=n.first),d(n=c())&&(i.image=n.first)}},hostBindings:function(t,i){t&1&&f("resize",function(){return i.resizeCanvas()},!1,g)("mousemove",function(a){return i.onMousemove(a)})("click",function(a){return i.onClick(a)})},standalone:!0,features:[p],decls:7,vars:0,consts:[["settings",""],["canvas","",1,"w-full","h-full"],["canvasFrame",""],["canvas",""]],template:function(t,i){t&1&&(r(0,"app-layout")(1,"div",0),v(2,"Graph"),l(),r(3,"div",1,2),m(5,"canvas",null,3),l()())},dependencies:[w]});let h=s;return h})();export{L as HomeComponent};