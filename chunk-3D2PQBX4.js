import{a as C}from"./chunk-3GHLPITM.js";import"./chunk-QWULPANI.js";import{Ka as a,La as o,Ma as g,Na as I,P as M,Ta as y,Ua as u,Va as S,Wa as i,Ya as R,na as E,oa as F}from"./chunk-FZ62MYCG.js";var f={boid:{boid:{separationFactor:.05,alignmentFactor:.02,cohesionFactor:5e-4,avoidFactor:0},shark:{separationFactor:.1,alignmentFactor:-.001,cohesionFactor:-.1,avoidFactor:.1}},shark:{boid:{separationFactor:0,alignmentFactor:1e-4,cohesionFactor:.001,avoidFactor:-.1},shark:{separationFactor:.05,alignmentFactor:.02,cohesionFactor:5e-4,avoidFactor:1}}};var v={boid:{type:"boid",colour:"white"},shark:{type:"shark",colour:"red"}};var L=class{constructor(c,b,e=v.boid.type,s=.01){this.pos={x:0,y:0},this.vel={x:0,y:0},this.heading=0,this.boidType=v.boid.type,this.timeLast=0,this.settings={protectedRange:10,visualRange:80,maxSpeed:300,minSpeed:150,turnFactor:4,colour:"white"},this.xIndex=0,this.yIndex=0,this.pos.x=c,this.pos.y=b,this.boidType=e,this.settings.colour=v[e].colour,this.xIndex=Math.floor(this.pos.x/(2*this.settings.visualRange)),this.yIndex=Math.floor(this.pos.y/(2*this.settings.visualRange)),this.heading=s,this.timeLast=Date.now()}setCoordinate(c){this.pos.x=c.x,this.pos.y=c.y}computePosition(c,b,e){let s={},t={},n={},l={},p={};for(let r in v){let h=v[r].type;s[h]=0,t[h]=0,n[h]=0,l[h]=0,p[h]=0}c.forEach((r,h)=>{let B=b.get(this)?.get(r)||0;B<this.settings.protectedRange&&(this.vel.x+=(this.pos.x-r.pos.x)*f[this.boidType][r.boidType].separationFactor,this.vel.y+=(this.pos.y-r.pos.y)*f[this.boidType][r.boidType].separationFactor),B<this.settings.visualRange&&B>this.settings.protectedRange&&(this.vel.x+=(this.pos.x-r.pos.x)*f[this.boidType][r.boidType].avoidFactor,this.vel.y+=(this.pos.y-r.pos.y)*f[this.boidType][r.boidType].avoidFactor,s[r.boidType]+=r.vel.x,t[r.boidType]+=r.vel.y,n[r.boidType]+=r.pos.x,l[r.boidType]+=r.pos.y,p[r.boidType]++)});for(let r in v){let h=v[r].type;p[h]>0&&(s[h]/=p[h],t[h]/=p[h],this.vel.x+=(s[h]-this.vel.x)*f[this.boidType][h].alignmentFactor,this.vel.y+=(t[h]-this.vel.y)*f[this.boidType][h].alignmentFactor,n[h]/=p[h],l[h]/=p[h],this.vel.x+=(n[h]-this.pos.x)*f[this.boidType][h].cohesionFactor,this.vel.y+=(l[h]-this.pos.y)*f[this.boidType][h].cohesionFactor)}this.pos.x<e.left&&(this.vel.x+=this.settings.turnFactor),this.pos.x>e.right&&(this.vel.x-=this.settings.turnFactor),this.pos.y<e.top&&(this.vel.y+=this.settings.turnFactor),this.pos.y>e.bottom&&(this.vel.y-=this.settings.turnFactor);let d=Math.sqrt(this.vel.x*this.vel.x+this.vel.y*this.vel.y);this.vel.x*this.vel.x+this.vel.y*this.vel.y<=0&&(d=0),d>this.settings.maxSpeed&&(this.vel.x=this.vel.x/d*this.settings.maxSpeed,this.vel.y=this.vel.y/d*this.settings.maxSpeed),d<this.settings.minSpeed&&(this.vel.x=this.vel.x/d*this.settings.minSpeed,this.vel.y=this.vel.y/d*this.settings.minSpeed),d==0&&(this.vel.x=this.settings.minSpeed*Math.sin(this.heading+Math.PI),this.vel.y=-this.settings.minSpeed*Math.cos(this.heading));let m=1,x=(Math.random()*2*m-m)*Math.PI/180;this.vel.x=this.vel.x*Math.cos(x)-this.vel.y*Math.sin(x),this.vel.y=this.vel.x*Math.sin(x)+this.vel.y*Math.cos(x);let w=this.getTimeStep();this.pos.x+=this.vel.x*w,this.pos.y+=this.vel.y*w,this.heading=Math.atan2(this.vel.y,this.vel.x)+Math.PI/2}getTimeStep(){let c=Date.now(),b=c-this.timeLast;return this.timeLast=c,b/1e3}};var A=["canvas"],k=["canvasFrame"],P=["image"],H=["deleteButton"],D=["resetButton"],W=(()=>{let c=class c{constructor(){this.boidCount=500,this.sharkCount=1,this.boidHeight=7,this.boidScale=.7,this.boidList=[],this.gridLists=[],this.testBoid=new L(0,0),this.paused=!1,this.showGrid=!1,this.showBoidRange=!1,this.margin=100,this.showBoidTrail=!1,this.boidTrailLength=50,this.boidTrail=new Map,this.shiftPressed=!1}ngAfterViewInit(){if(this.canvas===void 0||this.canvasFrame===void 0){console.log("Canvas not found");return}this.ctx=this.canvas.nativeElement.getContext("2d"),this.resizeCanvas(),this.paused||(this.paused=!0,this.toggleTime()),this.testBoid.settings.visualRange*=this.boidScale,this.testBoid.settings.protectedRange*=this.boidScale,this.gridLists=Array.from({length:Math.ceil(this.ctx.canvas.width/(2*this.testBoid.settings.visualRange))},()=>Array.from({length:Math.ceil(this.ctx.canvas.height/(2*this.testBoid.settings.visualRange))},()=>[])),this.spawnBoids(this.boidCount,"boid"),this.spawnBoids(this.sharkCount,"shark"),this.updateCanvas()}resizeCanvas(){if(this.canvas===void 0||this.canvasFrame===void 0){console.log("Canvas not found");return}let e=this.canvasFrame.nativeElement;this.ctx.canvas.width=e.clientWidth,this.ctx.canvas.height=e.clientHeight,this.updateCanvas()}toggleTime(){this.paused?(this.timeLoop=setInterval(()=>{this.computeBoids()},10),this.paused=!1):(clearInterval(this.timeLoop),this.paused=!0)}updateCanvas(){this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height),this.boidList.forEach(e=>this.drawBoid(e)),this.showGrid&&this.drawGrid(),this.showBoidTrail&&this.drawTrail()}drawTrail(){this.boidTrail.forEach((e,s)=>{this.ctx.beginPath(),this.ctx.moveTo(e[0].x,e[0].y),e.forEach(t=>{this.ctx.lineTo(t.x,t.y)}),this.ctx.strokeStyle=s.settings.colour,this.ctx.stroke()})}drawGrid(){this.gridLists.forEach((e,s)=>{e.forEach((t,n)=>{(s+n)%2===0?this.ctx.fillStyle="rgba(255, 0, 0, 0.1)":this.ctx.fillStyle="rgba(255, 0, 0, 0)",this.ctx.fillRect(s*2*this.testBoid.settings.visualRange,n*2*this.testBoid.settings.visualRange,2*this.testBoid.settings.visualRange,2*this.testBoid.settings.visualRange)})})}drawBoid(e){this.ctx.save(),this.ctx.translate(e.pos.x,e.pos.y),this.ctx.rotate(e.heading),this.ctx.beginPath(),this.ctx.moveTo(0,-this.boidHeight*this.boidScale),this.ctx.lineTo(Math.round(this.boidHeight*this.boidScale*.7),this.boidHeight*this.boidScale),this.ctx.lineTo(-Math.round(this.boidHeight*this.boidScale*.7),this.boidHeight*this.boidScale),this.ctx.lineTo(0,-this.boidHeight*this.boidScale),this.ctx.fillStyle=e.settings.colour,this.ctx.fill(),this.ctx.closePath(),this.ctx.restore(),this.showBoidRange&&(this.ctx.beginPath(),this.ctx.arc(e.pos.x,e.pos.y,e.settings.visualRange,0,2*Math.PI,!1),this.ctx.arc(e.pos.x,e.pos.y,e.settings.protectedRange,2*Math.PI,0,!0),this.ctx.closePath(),e.boidType==="shark"?this.ctx.fillStyle="rgba(255, 0, 0, 0.1)":this.ctx.fillStyle="rgba(255, 255, 255, 0.1)",this.ctx.fill())}spawnBoids(e,s,t=-1,n={x:this.ctx.canvas.width/2,y:this.ctx.canvas.height/2}){let l,p;t===-1?(l=this.ctx.canvas.width-80,p=this.ctx.canvas.height-80):(l=t,p=t);for(let d=0;d<e;d++){let m=n.x+Math.random()*l-l/2,x=n.y+Math.random()*p-p/2;this.boidList.push(new L(m,x,s)),s==="shark"&&(this.boidList[this.boidList.length-1].settings.turnFactor*=2),this.boidList[this.boidList.length-1].settings.visualRange*=this.boidScale,this.boidList[this.boidList.length-1].settings.protectedRange*=this.boidScale,this.boidList[this.boidList.length-1].settings.maxSpeed*=this.boidScale,this.boidList[this.boidList.length-1].settings.minSpeed*=this.boidScale,this.gridLists[this.boidList[this.boidList.length-1].xIndex][this.boidList[this.boidList.length-1].yIndex].push(this.boidList[this.boidList.length-1])}}handleKeyboardEvent(e){let s=e.key;console.log(s),s===" "&&this.toggleTime(),s==="x"&&this.computeBoids(),s==="g"&&(this.showGrid=!this.showGrid),s==="r"&&(this.showBoidRange=!this.showBoidRange),s==="t"&&(this.showBoidTrail=!this.showBoidTrail),s==="ArrowUp"&&(e.getModifierState("Control")?this.boidTrailLength+=50:e.getModifierState("Alt")&&e.getModifierState("Shift")?this.spawnBoids(50,"shark"):e.getModifierState("Alt")?this.spawnBoids(1,"shark"):e.getModifierState("Shift")?this.spawnBoids(50,"boid"):this.spawnBoids(1,"boid")),s==="ArrowDown"&&(e.getModifierState("Control")?(this.boidTrailLength-=50,this.boidTrailLength=Math.max(this.boidTrailLength,0)):e.getModifierState("Alt")&&e.getModifierState("Shift")?this.removeBoid(50,"shark"):e.getModifierState("Alt")?this.removeBoid(1,"shark"):e.getModifierState("Shift")?this.removeBoid(50):this.boidList.length>0&&this.removeBoid()),this.updateCanvas()}removeBoid(e=1,s="boid"){let t=0;for(let n=this.boidList.length-1;n>=0&&!(t>=e);n--)this.boidList[n].boidType===s&&(this.gridLists[this.boidList[n].xIndex][this.boidList[n].yIndex].filter(l=>l!==this.boidList[n]),this.boidTrail.delete(this.boidList[n]),this.boidList.splice(n,1),t++)}computeBoids(){let e=new Map,s=new Map;this.boidList.forEach((t,n)=>{e.set(t,new Map),s.set(t,[]);let l=t.xIndex,p=t.yIndex;for(let d=-1;d<=1;d++)for(let m=-1;m<=1;m++)this.gridLists[l+d]==null||this.gridLists[l+d][p+m]==null||this.gridLists[l+d][p+m].forEach(x=>{if(x==t)return;let w=Math.sqrt((t.pos.x-x.pos.x)**2+(t.pos.y-x.pos.y)**2);e.get(t)?.set(x,w),w<t.settings.visualRange&&s.get(t)?.push(x)})}),this.boidList.forEach(t=>{if(this.gridLists[t.xIndex]&&this.gridLists[t.xIndex][t.yIndex]&&(this.gridLists[t.xIndex][t.yIndex]=this.gridLists[t.xIndex][t.yIndex].filter(n=>n!==t)),t.computePosition(s.get(t)||[],e,{left:0+this.margin,right:this.ctx.canvas.width-this.margin,top:0+this.margin,bottom:this.ctx.canvas.height-this.margin}),t.xIndex=Math.floor(t.pos.x/(2*t.settings.visualRange)),t.yIndex=Math.floor(t.pos.y/(2*t.settings.visualRange)),this.showBoidTrail)if(this.boidTrail.has(t)||this.boidTrail.set(t,[]),this.boidTrail.get(t)?.push({x:t.pos.x,y:t.pos.y}),this.boidTrailLength==0)this.boidTrail.delete(t);else for(;(this.boidTrail.get(t)?.length||0)>this.boidTrailLength;)this.boidTrail.get(t)?.shift();this.gridLists[t.xIndex]&&this.gridLists[t.xIndex][t.yIndex]&&this.gridLists[t.xIndex][t.yIndex].push(t)}),this.updateCanvas()}};c.\u0275fac=function(s){return new(s||c)},c.\u0275cmp=M({type:c,selectors:[["app-boids"]],viewQuery:function(s,t){if(s&1&&(y(A,5),y(k,5),y(P,5),y(H,5),y(D,5)),s&2){let n;u(n=S())&&(t.canvas=n.first),u(n=S())&&(t.canvasFrame=n.first),u(n=S())&&(t.image=n.first),u(n=S())&&(t.deleteButton=n.first),u(n=S())&&(t.resetButton=n.first)}},hostBindings:function(s,t){s&1&&I("resize",function(){return t.resizeCanvas()},!1,E)("keydown",function(l){return t.handleKeyboardEvent(l)},!1,F)},standalone:!0,features:[R],decls:99,vars:0,consts:[["settings",""],[1,"text-2xl","font-bold"],[1,"font-bold"],["canvas","",1,"w-full","h-full","relative"],["canvasFrame",""],["canvas",""]],template:function(s,t){s&1&&(a(0,"app-layout")(1,"div",0)(2,"h1",1),i(3,"Boids Controls"),o(),a(4,"p"),i(5,"Press "),a(6,"span",2),i(7,"Space"),o(),i(8," to toggle time "),a(9,"span",2),i(10,"x"),o(),i(11," -- to step time"),g(12,"br"),a(13,"span",2),i(14,"g"),o(),i(15," -- to toggle grid"),g(16,"br"),a(17,"span",2),i(18,"r"),o(),i(19," -- to toggle boid range"),g(20,"br"),a(21,"span",2),i(22,"t"),o(),i(23," -- to toggle boid trail"),g(24,"br"),a(25,"span",2),i(26,"Arrow Up"),o(),i(27," -- to add boids"),g(28,"br"),a(29,"span",2),i(30,"Arrow Down"),o(),i(31," -- to remove boids"),g(32,"br"),a(33,"span",2),i(34,"Alt"),o(),i(35," + "),a(36,"span",2),i(37,"Arrow Up"),o(),i(38," -- to add sharks"),g(39,"br"),a(40,"span",2),i(41,"Alt"),o(),i(42," + "),a(43,"span",2),i(44,"Arrow Down"),o(),i(45," -- to remove sharks"),g(46,"br"),a(47,"span",2),i(48,"Shift"),o(),i(49," + "),a(50,"span",2),i(51,"Arrow Up"),o(),i(52," -- to add 50 boids"),g(53,"br"),a(54,"span",2),i(55,"Shift"),o(),i(56," + "),a(57,"span",2),i(58,"Arrow Down"),o(),i(59," -- to remove 50 boids"),g(60,"br"),a(61,"span",2),i(62,"Alt"),o(),i(63," + "),a(64,"span",2),i(65,"Shift"),o(),i(66," + "),a(67,"span",2),i(68,"Arrow Up"),o(),i(69," -- to add 50 sharks"),g(70,"br"),a(71,"span",2),i(72,"Alt"),o(),i(73," + "),a(74,"span",2),i(75,"Shift"),o(),i(76," + "),a(77,"span",2),i(78,"Arrow Down"),o(),i(79," -- to remove 50 sharks"),g(80,"br"),a(81,"span",2),i(82,"Ctrl"),o(),i(83," + "),a(84,"span",2),i(85,"Arrow Up"),o(),i(86," -- to increase boid trail length"),g(87,"br"),a(88,"span",2),i(89,"Ctrl"),o(),i(90," + "),a(91,"span",2),i(92,"Arrow Down"),o(),i(93," -- to decrease boid trail length"),g(94,"br"),o()(),a(95,"div",3,4),g(97,"canvas",null,5),o()())},dependencies:[C]});let T=c;return T})();export{W as BoidsComponent};
