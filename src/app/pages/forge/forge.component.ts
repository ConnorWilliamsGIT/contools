import {AfterViewInit, Component, computed, ElementRef, HostListener, signal, ViewChild} from '@angular/core';
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
export class ForgeComponent{
  protected imageUrl: string = "";
  protected exampleImg: string = '../../../assets/img/exampleForge.png';

  forgeText = signal<string[]>([]);




  constructor() {}

  async pasteImage() {
    const clipboardContents = await navigator.clipboard.read();
    for (const item of clipboardContents) {
      if (!item.types.includes("image/png")) {
        console.log("Clipboard item is not an image");
        continue;
      }
      const imageObject = await item.getType("image/png");

      this.imageUrl = URL.createObjectURL(imageObject);
      this.processImage();
    }
  }

  processImage() {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    const img = new Image();

    img.onload = () => {
      if (ctx === null) {
        console.log("Context is null");
        return;
      }


      canvas.width = img.width; canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width,canvas.height);
      let imgData = ctx.getImageData(0, 0, img.width, img.height);


      let count = 0;
      let aFound = false;
      let aRow = 0;
      let aCol = 0;

      for (let row = 0; row < img.height; row++) {
        for (let col = 0; col < img.width; col++) {
          let pixel = this.getPixel(imgData, row * img.width + col);
          if (pixel[0] == 63 && pixel[1] == 63 && pixel[2] == 63) {
            count += 1;

            if (!aFound) {
              aFound = true;
              aRow = row;
              aCol = col;
            }
          } else if (aFound) {
            break;
          }
        }
        if (aFound) {
          break;
        }
      }

      console.log("count: " + count);
      let pixelWidth = count/3;
      aCol -= pixelWidth;

      console.log("aRow: " + aRow);
      console.log("aCol: " + aCol);


      let greenFound = false;
      let greenCol = 0;

      let redFound = false;
      let redCol = 0;

      let rowCheck = 96;
      for (let col = 0; col < img.width; col++) {
        let pixel = this.getPixel(imgData, (rowCheck*pixelWidth + aRow) * img.width + col);
        if (pixel[0] == 0 && pixel[1] == 255 && pixel[2] == 6) {
          rowCheck = 90;
          greenCol = col;
        }

        if (pixel[0] == 255 && pixel[1] == 0 && pixel[2] == 0) {
          redCol = col;
          break;
        }
      }

      console.log("greenCol: " + greenCol);
      console.log("redCol: " + redCol);

      let distance = (redCol - greenCol)/pixelWidth;
      console.log("distance: " + distance);

      let [steps, moves] = this.minStepsToN(distance);
      this.forgeText.set(moves.map((move) => move.toString()));


      ctx.putImageData(imgData, 0,0);  // 0,0 is xy coordinates

      console.log("updated image");
      this.imageUrl = canvas.toDataURL();
    }

    img.src = this.imageUrl;

    return;
  }

  getPixel(imgData : ImageData, index : number) {
    return imgData.data.subarray(index*4, index*4+4); // Uint8ClampedArray(4) [R,G,B,A]
  }

  setPixel(imgData : ImageData, index : number, pixelData : number[] /*[R,G,B,A]*/) {
    imgData.data.set(pixelData, index*4);
  }

  minStepsToN(n: number): [number, number[]] {
    const moves = [-15, -9, -6, -3, 2, 7, 13, 16];
    const maxLimit = 150;

    type State = { sum: number, steps: number, path: number[] };
    const queue: State[] = [{ sum: 0, steps: 0, path: [] }];
    const visited = new Set<number>([0]);

    while (queue.length > 0) {
        const { sum, steps, path } = queue.shift()!;

        if (sum === n) {
            console.log(`Steps: ${steps}`);
            console.log(`Path: ${path.join(" → ")}`);
            return [steps, path];
        }

        for (const move of moves) {
            const newSum = sum + move;

            if (newSum > maxLimit || visited.has(newSum)) continue;

            queue.push({ sum: newSum, steps: steps + 1, path: [...path, move] });
            visited.add(newSum);
        }
    }

    console.log("No solution found.");
    return [-1, []];
}
}
