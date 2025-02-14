import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-forge',
  standalone: true,
  imports: [
    NgIf,
    NgOptimizedImage
  ],
  templateUrl: './forge.component.html',
  styleUrl: './forge.component.scss'
})
export class ForgeComponent {
  protected imageUrl: string | null = null;
  protected exampleImg: string = '../../../assets/img/exampleForge.png';

  constructor() {}

  ngOnInit() {}

  async pasteImage() {
    const clipboardContents = await navigator.clipboard.read();
    for (const item of clipboardContents) {
      if (!item.types.includes("image/png")) {
        console.log("Clipboard item is not an image");
        continue;
      }
      const imageObject = await item.getType("image/png");

      this.imageUrl = URL.createObjectURL(imageObject);

      console.log("Image pasted");
      console.log(this.imageUrl);
    }
  }
}
