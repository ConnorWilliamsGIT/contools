import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {RouterLink} from "@angular/router";
import {LayoutComponent} from "../../components/layout/layout.component";

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

  ngAfterViewInit(): void {
    if (this.canvas === undefined || this.canvasFrame === undefined) {
      console.log("Canvas not found");
      return;
    }

    const ctx = this.canvas.nativeElement.getContext("2d");
    const canvasFrame = this.canvasFrame.nativeElement;

    ctx.canvas.width = canvasFrame.clientWidth;
    ctx.canvas.height = canvasFrame.clientHeight;
    console.log("Canvas", ctx.canvas.width, ctx.canvas.height)

    const img = new Image();
    img.onload = () => {

      const x = (ctx.canvas.width - img.width * 0.3) / 2;
      const y = (ctx.canvas.height - img.height * 0.3) / 2;
      
      ctx.drawImage(img, x, y, img.width * 0.3, img.height * 0.3);


    }
    img.src = "https://media.licdn.com/dms/image/D5603AQHNteNbj0wR1w/profile-displayphoto-shrink_800_800/0/1705715328463?e=1715212800&v=beta&t=wVcIyNOl3h_1b_FK7aloU_aWNC7fHl9UrdbQhSdj1XU";

  }

  // add click listener
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    console.log("Clicked", event);
  }

}
