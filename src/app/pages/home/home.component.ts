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

  ngAfterViewInit(): void {
    if (this.canvas === undefined) {
      console.log("Canvas not found");
      return;
    }

    const ctx = this.canvas.nativeElement.getContext("2d");
    const canvasWidth = this.canvas.nativeElement.width;
    const canvasHeight = this.canvas.nativeElement.height;
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    console.log("Canvas found")
  }

  // add click listener
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    console.log("Clicked", event);
  }

}
