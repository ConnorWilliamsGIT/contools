import"./chunk-KBLU6FE2.js";import{a as g}from"./chunk-UYS7BA6S.js";import{Aa as u,Ea as o,Fa as s,Ga as c,Ha as f,Ia as p,O as h,xa as d,ya as m,za as v}from"./chunk-AJBJHZNS.js";var y=["canvas"],w=["canvasFrame"],C=["image"],Q=(()=>{let a=class a{ngAfterViewInit(){if(this.canvas===void 0||this.canvasFrame===void 0){console.log("Canvas not found");return}let n=this.canvas.nativeElement.getContext("2d"),t=this.canvasFrame.nativeElement;n.canvas.width=t.clientWidth,n.canvas.height=t.clientHeight,console.log("Canvas",n.canvas.width,n.canvas.height);let e=new Image;e.onload=()=>{let i=(n.canvas.width-e.width*.3)/2,l=(n.canvas.height-e.height*.3)/2;n.drawImage(e,i,l,e.width*.3,e.height*.3)},e.src="https://media.licdn.com/dms/image/D5603AQHNteNbj0wR1w/profile-displayphoto-shrink_800_800/0/1705715328463?e=1715212800&v=beta&t=wVcIyNOl3h_1b_FK7aloU_aWNC7fHl9UrdbQhSdj1XU"}onClick(n){console.log("Clicked",n)}};a.\u0275fac=function(t){return new(t||a)},a.\u0275cmp=h({type:a,selectors:[["app-home"]],viewQuery:function(t,e){if(t&1&&(o(y,5),o(w,5),o(C,5)),t&2){let i;s(i=c())&&(e.canvas=i.first),s(i=c())&&(e.canvasFrame=i.first),s(i=c())&&(e.image=i.first)}},hostBindings:function(t,e){t&1&&u("click",function(l){return e.onClick(l)})},standalone:!0,features:[p],decls:7,vars:0,consts:[["settings",""],["canvas","",1,"w-full","h-full"],["canvasFrame",""],["canvas",""]],template:function(t,e){t&1&&(d(0,"app-layout")(1,"div",0),f(2,"Graph"),m(),d(3,"div",1,2),v(5,"canvas",null,3),m()())},dependencies:[g]});let r=a;return r})();export{Q as HomeComponent};
