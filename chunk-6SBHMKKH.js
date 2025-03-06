import{a as C}from"./chunk-3GHLPITM.js";import"./chunk-QWULPANI.js";import{Ka as h,La as a,Ma as x,Na as I,P as M,Ta as y,Ua as u,Va as S,Wa as e,Ya as R,na as E,oa as F}from"./chunk-FZ62MYCG.js";var f={boid:{boid:{separationFactor:.05,alignmentFactor:.02,cohesionFactor:5e-4,avoidFactor:0},shark:{separationFactor:.1,alignmentFactor:-.001,cohesionFactor:-.1,avoidFactor:.1}},shark:{boid:{separationFactor:0,alignmentFactor:1e-4,cohesionFactor:.001,avoidFactor:-.1},shark:{separationFactor:.05,alignmentFactor:.02,cohesionFactor:5e-4,avoidFactor:1}}};var v={boid:{type:"boid",colour:"white"},shark:{type:"shark",colour:"red"}};var L=class{constructor(c,b,i=v.boid.type,n=.01){this.pos={x:0,y:0},this.vel={x:0,y:0},this.heading=0,this.boidType=v.boid.type,this.timeLast=0,this.settings={protectedRange:10,visualRange:80,maxSpeed:300,minSpeed:150,turnFactor:4,colour:"white"},this.xIndex=0,this.yIndex=0,this.pos.x=c,this.pos.y=b,this.boidType=i,this.settings.colour=v[i].colour,this.xIndex=Math.floor(this.pos.x/(2*this.settings.visualRange)),this.yIndex=Math.floor(this.pos.y/(2*this.settings.visualRange)),this.heading=n,this.timeLast=Date.now()}setCoordinate(c){this.pos.x=c.x,this.pos.y=c.y}computePosition(c,b,i){let n={},t={},s={},l={},g={};for(let r in v){let o=v[r].type;n[o]=0,t[o]=0,s[o]=0,l[o]=0,g[o]=0}c.forEach((r,o)=>{let B=b.get(this)?.get(r)||0;B<this.settings.protectedRange&&(this.vel.x+=(this.pos.x-r.pos.x)*f[this.boidType][r.boidType].separationFactor,this.vel.y+=(this.pos.y-r.pos.y)*f[this.boidType][r.boidType].separationFactor),B<this.settings.visualRange&&B>this.settings.protectedRange&&(this.vel.x+=(this.pos.x-r.pos.x)*f[this.boidType][r.boidType].avoidFactor,this.vel.y+=(this.pos.y-r.pos.y)*f[this.boidType][r.boidType].avoidFactor,n[r.boidType]+=r.vel.x,t[r.boidType]+=r.vel.y,s[r.boidType]+=r.pos.x,l[r.boidType]+=r.pos.y,g[r.boidType]++)});for(let r in v){let o=v[r].type;g[o]>0&&(n[o]/=g[o],t[o]/=g[o],this.vel.x+=(n[o]-this.vel.x)*f[this.boidType][o].alignmentFactor,this.vel.y+=(t[o]-this.vel.y)*f[this.boidType][o].alignmentFactor,s[o]/=g[o],l[o]/=g[o],this.vel.x+=(s[o]-this.pos.x)*f[this.boidType][o].cohesionFactor,this.vel.y+=(l[o]-this.pos.y)*f[this.boidType][o].cohesionFactor)}this.pos.x<i.left&&(this.vel.x+=this.settings.turnFactor),this.pos.x>i.right&&(this.vel.x-=this.settings.turnFactor),this.pos.y<i.top&&(this.vel.y+=this.settings.turnFactor),this.pos.y>i.bottom&&(this.vel.y-=this.settings.turnFactor);let d=Math.sqrt(this.vel.x*this.vel.x+this.vel.y*this.vel.y);this.vel.x*this.vel.x+this.vel.y*this.vel.y<=0&&(d=0),d>this.settings.maxSpeed&&(this.vel.x=this.vel.x/d*this.settings.maxSpeed,this.vel.y=this.vel.y/d*this.settings.maxSpeed),d<this.settings.minSpeed&&(this.vel.x=this.vel.x/d*this.settings.minSpeed,this.vel.y=this.vel.y/d*this.settings.minSpeed),d==0&&(this.vel.x=this.settings.minSpeed*Math.sin(this.heading+Math.PI),this.vel.y=-this.settings.minSpeed*Math.cos(this.heading));let m=1,p=(Math.random()*2*m-m)*Math.PI/180;this.vel.x=this.vel.x*Math.cos(p)-this.vel.y*Math.sin(p),this.vel.y=this.vel.x*Math.sin(p)+this.vel.y*Math.cos(p);let w=this.getTimeStep();this.pos.x+=this.vel.x*w,this.pos.y+=this.vel.y*w,this.heading=Math.atan2(this.vel.y,this.vel.x)+Math.PI/2}getTimeStep(){let c=Date.now(),b=c-this.timeLast;return this.timeLast=c,b/1e3}};var A=["canvas"],k=["canvasFrame"],P=["image"],H=["deleteButton"],D=["resetButton"],W=(()=>{let c=class c{constructor(){this.boidCount=500,this.sharkCount=1,this.boidHeight=7,this.boidScale=.7,this.boidList=[],this.gridLists=[],this.testBoid=new L(0,0),this.paused=!1,this.showGrid=!1,this.showBoidRange=!1,this.margin=100,this.showBoidTrail=!1,this.boidTrailLength=50,this.boidTrail=new Map,this.shiftPressed=!1}ngAfterViewInit(){if(this.canvas===void 0||this.canvasFrame===void 0){console.log("Canvas not found");return}this.ctx=this.canvas.nativeElement.getContext("2d"),this.resizeCanvas(),this.paused||(this.paused=!0,this.toggleTime()),this.testBoid.settings.visualRange*=this.boidScale,this.testBoid.settings.protectedRange*=this.boidScale,this.gridLists=Array.from({length:Math.ceil(this.ctx.canvas.width/(2*this.testBoid.settings.visualRange))},()=>Array.from({length:Math.ceil(this.ctx.canvas.height/(2*this.testBoid.settings.visualRange))},()=>[])),this.spawnBoids(this.boidCount,"boid"),this.spawnBoids(this.sharkCount,"shark"),this.updateCanvas()}resizeCanvas(){if(this.canvas===void 0||this.canvasFrame===void 0){console.log("Canvas not found");return}let i=this.canvasFrame.nativeElement;this.ctx.canvas.width=i.clientWidth,this.ctx.canvas.height=i.clientHeight,this.updateCanvas()}toggleTime(){this.paused?(this.timeLoop=setInterval(()=>{this.computeBoids()},10),this.paused=!1):(clearInterval(this.timeLoop),this.paused=!0)}updateCanvas(){this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height),this.boidList.forEach(i=>this.drawBoid(i)),this.showGrid&&this.drawGrid(),this.showBoidTrail&&this.drawTrail()}drawTrail(){this.boidTrail.forEach((i,n)=>{this.ctx.beginPath(),this.ctx.moveTo(i[0].x,i[0].y),i.forEach(t=>{this.ctx.lineTo(t.x,t.y)}),this.ctx.strokeStyle=n.settings.colour,this.ctx.stroke()})}drawGrid(){this.gridLists.forEach((i,n)=>{i.forEach((t,s)=>{(n+s)%2===0?this.ctx.fillStyle="rgba(255, 0, 0, 0.1)":this.ctx.fillStyle="rgba(255, 0, 0, 0)",this.ctx.fillRect(n*2*this.testBoid.settings.visualRange,s*2*this.testBoid.settings.visualRange,2*this.testBoid.settings.visualRange,2*this.testBoid.settings.visualRange)})})}drawBoid(i){this.ctx.save(),this.ctx.translate(i.pos.x,i.pos.y),this.ctx.rotate(i.heading),this.ctx.beginPath(),this.ctx.moveTo(0,-this.boidHeight*this.boidScale),this.ctx.lineTo(Math.round(this.boidHeight*this.boidScale*.7),this.boidHeight*this.boidScale),this.ctx.lineTo(-Math.round(this.boidHeight*this.boidScale*.7),this.boidHeight*this.boidScale),this.ctx.lineTo(0,-this.boidHeight*this.boidScale),this.ctx.fillStyle=i.settings.colour,this.ctx.fill(),this.ctx.closePath(),this.ctx.restore(),this.showBoidRange&&(this.ctx.beginPath(),this.ctx.arc(i.pos.x,i.pos.y,i.settings.visualRange,0,2*Math.PI,!1),this.ctx.arc(i.pos.x,i.pos.y,i.settings.protectedRange,2*Math.PI,0,!0),this.ctx.closePath(),i.boidType==="shark"?this.ctx.fillStyle="rgba(255, 0, 0, 0.1)":this.ctx.fillStyle="rgba(255, 255, 255, 0.1)",this.ctx.fill())}spawnBoids(i,n,t=-1,s={x:this.ctx.canvas.width/2,y:this.ctx.canvas.height/2}){let l,g;t===-1?(l=this.ctx.canvas.width-80,g=this.ctx.canvas.height-80):(l=t,g=t);for(let d=0;d<i;d++){let m=s.x+Math.random()*l-l/2,p=s.y+Math.random()*g-g/2;this.boidList.push(new L(m,p,n)),n==="shark"&&(this.boidList[this.boidList.length-1].settings.turnFactor*=2),this.boidList[this.boidList.length-1].settings.visualRange*=this.boidScale,this.boidList[this.boidList.length-1].settings.protectedRange*=this.boidScale,this.boidList[this.boidList.length-1].settings.maxSpeed*=this.boidScale,this.boidList[this.boidList.length-1].settings.minSpeed*=this.boidScale,this.gridLists[this.boidList[this.boidList.length-1].xIndex][this.boidList[this.boidList.length-1].yIndex].push(this.boidList[this.boidList.length-1])}}handleKeyboardEvent(i){let n=i.key;n===" "&&this.toggleTime(),n==="x"&&this.computeBoids(),n==="g"&&(this.showGrid=!this.showGrid),n==="r"&&(this.showBoidRange=!this.showBoidRange),n==="t"&&(this.showBoidTrail=!this.showBoidTrail),n==="ArrowUp"&&(i.getModifierState("Control")?this.boidTrailLength+=50:i.getModifierState("Alt")&&i.getModifierState("Shift")?this.spawnBoids(50,"shark"):i.getModifierState("Alt")?this.spawnBoids(1,"shark"):i.getModifierState("Shift")?this.spawnBoids(50,"boid"):this.spawnBoids(1,"boid")),n==="ArrowDown"&&(i.getModifierState("Control")?(this.boidTrailLength-=50,this.boidTrailLength=Math.max(this.boidTrailLength,0)):i.getModifierState("Alt")&&i.getModifierState("Shift")?this.removeBoid(50,"shark"):i.getModifierState("Alt")?this.removeBoid(1,"shark"):i.getModifierState("Shift")?this.removeBoid(50):this.boidList.length>0&&this.removeBoid()),this.updateCanvas()}removeBoid(i=1,n="boid"){let t=0;for(let s=this.boidList.length-1;s>=0&&!(t>=i);s--)this.boidList[s].boidType===n&&(this.gridLists[this.boidList[s].xIndex]?.[this.boidList[s].yIndex]&&(this.gridLists[this.boidList[s].xIndex][this.boidList[s].yIndex]=this.gridLists[this.boidList[s].xIndex][this.boidList[s].yIndex].filter(l=>l!==this.boidList[s])),this.boidTrail.delete(this.boidList[s]),this.boidList.splice(s,1),t++)}computeBoids(){let i=new Map,n=new Map;this.boidList.forEach((t,s)=>{i.set(t,new Map),n.set(t,[]);let l=t.xIndex,g=t.yIndex;for(let d=-1;d<=1;d++)for(let m=-1;m<=1;m++)this.gridLists[l+d]==null||this.gridLists[l+d][g+m]==null||this.gridLists[l+d][g+m].forEach(p=>{if(p==t)return;let w=Math.sqrt((t.pos.x-p.pos.x)**2+(t.pos.y-p.pos.y)**2);i.get(t)?.set(p,w),w<t.settings.visualRange&&n.get(t)?.push(p)})}),this.boidList.forEach(t=>{if(this.gridLists[t.xIndex]&&this.gridLists[t.xIndex][t.yIndex]&&(this.gridLists[t.xIndex][t.yIndex]=this.gridLists[t.xIndex][t.yIndex].filter(s=>s!==t)),t.computePosition(n.get(t)||[],i,{left:0+this.margin,right:this.ctx.canvas.width-this.margin,top:0+this.margin,bottom:this.ctx.canvas.height-this.margin}),t.xIndex=Math.floor(t.pos.x/(2*t.settings.visualRange)),t.yIndex=Math.floor(t.pos.y/(2*t.settings.visualRange)),this.showBoidTrail)if(this.boidTrail.has(t)||this.boidTrail.set(t,[]),this.boidTrail.get(t)?.push({x:t.pos.x,y:t.pos.y}),this.boidTrailLength==0)this.boidTrail.delete(t);else for(;(this.boidTrail.get(t)?.length||0)>this.boidTrailLength;)this.boidTrail.get(t)?.shift();this.gridLists[t.xIndex]&&this.gridLists[t.xIndex][t.yIndex]&&this.gridLists[t.xIndex][t.yIndex].push(t)}),this.updateCanvas()}};c.\u0275fac=function(n){return new(n||c)},c.\u0275cmp=M({type:c,selectors:[["app-boids"]],viewQuery:function(n,t){if(n&1&&(y(A,5),y(k,5),y(P,5),y(H,5),y(D,5)),n&2){let s;u(s=S())&&(t.canvas=s.first),u(s=S())&&(t.canvasFrame=s.first),u(s=S())&&(t.image=s.first),u(s=S())&&(t.deleteButton=s.first),u(s=S())&&(t.resetButton=s.first)}},hostBindings:function(n,t){n&1&&I("resize",function(){return t.resizeCanvas()},!1,E)("keydown",function(l){return t.handleKeyboardEvent(l)},!1,F)},standalone:!0,features:[R],decls:99,vars:0,consts:[["settings",""],[1,"text-2xl","font-bold"],[1,"font-bold"],["canvas","",1,"w-full","h-full","relative"],["canvasFrame",""],["canvas",""]],template:function(n,t){n&1&&(h(0,"app-layout")(1,"div",0)(2,"h1",1),e(3,"Boids Controls"),a(),h(4,"p"),e(5,"Press "),h(6,"span",2),e(7,"Space"),a(),e(8," to toggle time "),h(9,"span",2),e(10,"x"),a(),e(11," -- to step time"),x(12,"br"),h(13,"span",2),e(14,"g"),a(),e(15," -- to toggle grid"),x(16,"br"),h(17,"span",2),e(18,"r"),a(),e(19," -- to toggle boid range"),x(20,"br"),h(21,"span",2),e(22,"t"),a(),e(23," -- to toggle boid trail"),x(24,"br"),h(25,"span",2),e(26,"Arrow Up"),a(),e(27," -- to add boids"),x(28,"br"),h(29,"span",2),e(30,"Arrow Down"),a(),e(31," -- to remove boids"),x(32,"br"),h(33,"span",2),e(34,"Alt"),a(),e(35," + "),h(36,"span",2),e(37,"Arrow Up"),a(),e(38," -- to add sharks"),x(39,"br"),h(40,"span",2),e(41,"Alt"),a(),e(42," + "),h(43,"span",2),e(44,"Arrow Down"),a(),e(45," -- to remove sharks"),x(46,"br"),h(47,"span",2),e(48,"Shift"),a(),e(49," + "),h(50,"span",2),e(51,"Arrow Up"),a(),e(52," -- to add 50 boids"),x(53,"br"),h(54,"span",2),e(55,"Shift"),a(),e(56," + "),h(57,"span",2),e(58,"Arrow Down"),a(),e(59," -- to remove 50 boids"),x(60,"br"),h(61,"span",2),e(62,"Alt"),a(),e(63," + "),h(64,"span",2),e(65,"Shift"),a(),e(66," + "),h(67,"span",2),e(68,"Arrow Up"),a(),e(69," -- to add 50 sharks"),x(70,"br"),h(71,"span",2),e(72,"Alt"),a(),e(73," + "),h(74,"span",2),e(75,"Shift"),a(),e(76," + "),h(77,"span",2),e(78,"Arrow Down"),a(),e(79," -- to remove 50 sharks"),x(80,"br"),h(81,"span",2),e(82,"Ctrl"),a(),e(83," + "),h(84,"span",2),e(85,"Arrow Up"),a(),e(86," -- to increase boid trail length"),x(87,"br"),h(88,"span",2),e(89,"Ctrl"),a(),e(90," + "),h(91,"span",2),e(92,"Arrow Down"),a(),e(93," -- to decrease boid trail length"),x(94,"br"),a()(),h(95,"div",3,4),x(97,"canvas",null,5),a()())},dependencies:[C]});let T=c;return T})();export{W as BoidsComponent};
