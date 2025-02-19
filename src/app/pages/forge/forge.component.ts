import {AfterViewInit, Component, computed, ElementRef, HostListener, OnInit, signal, ViewChild} from '@angular/core';
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
export class ForgeComponent implements OnInit {
  @ViewChild('errorModal') errorModal!: ElementRef<HTMLDialogElement>;
  // get modal from id
  private modalButton = document.getElementById("modal_button");
  protected imageUrl: string = "";
  protected exampleImg: string = '/assets/img/exampleForge.png';

  forgeText = signal<string[]>([]);




  constructor() {}

  ngOnInit() {
    this.modalButton = document.getElementById("modal_button");
  }

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
    try {
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');

      const img = new Image();


      img.onload = () => {
        if (ctx === null) {
          console.log("Context is null");
          return;
        }


        canvas.width = img.width;
        canvas.height = img.height;
        console.log("Image width: " + img.width);
        console.log("Image height: " + img.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        let imgData = ctx.getImageData(0, 0, img.width, img.height);

        let count = 0;
        let aFound = false;
        let aRow = 0;
        let aCol = 0;

        for (let row = 0; row < img.height; row++) {
          for (let col = 0; col < img.width; col++) {
            // console.log("Row: " + row + " Col: " + col);
            let pixel = this.getPixel(imgData, row * img.width + col);
            // Colour of the A in the anvil
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
        if (!aFound) {
          console.log("A not found");
          throw new Error("A not found");
        }

        let pixelWidth = count / 3;
        aCol -= pixelWidth;

        let greenCol = 0;

        let redCol = 0;

        let rowCheck = 96; // 96 is the number of minecraft pixels from the top of the A in anvil to the green pixel row
        for (let col = 0; col < img.width; col++) {
          let pixel = this.getPixel(imgData, (rowCheck * pixelWidth + aRow) * img.width + col);
          // Colour of the green pixel
          if (pixel[0] == 0 && pixel[1] == 255 && pixel[2] == 6) {
            greenCol = col;
            break;
          }
        }

        rowCheck = 90; // 90 is the number of minecraft pixels from the top of the A in anvil to the red pixel row
        for (let col = 0; col < img.width; col++) {
          let pixel = this.getPixel(imgData, (rowCheck * pixelWidth + aRow) * img.width + col);
          // Colour of the red pixel
          if (pixel[0] == 255 && pixel[1] == 0 && pixel[2] == 0) {
            redCol = col;
            break;
          }
        }


        let distance = (redCol - greenCol) / pixelWidth;
        console.log("distance: " + distance);

        if (isNaN(distance)){
          console.log("Distance is NaN");
          throw new Error("Distance is NaN");
        }

        const forgeColRanges = [
            [56, 66],
            [75, 85],
            [94, 104]
        ];

        let forgeRows1 = [0, 0, 0];
        let forgeCols1 = [0, 0, 0];

        for (let i = 0; i < forgeColRanges.length; i++) {
            for (let row = aRow + 4 * pixelWidth; row < aRow + 14 * pixelWidth; row++) {
                for (let col = aCol + forgeColRanges[i][0] * pixelWidth; col < aCol + forgeColRanges[i][1] * pixelWidth; col++) {
                    let pixel = this.getPixel(imgData, row * img.width + col);
                    if (pixel[0] > 100 && pixel[1] > 100 && pixel[2] > 100) {
                        forgeRows1[i] = row;
                        forgeCols1[i] = col;
                        break;
                    }
                }
                if (forgeRows1[i] !== 0) {
                    break;
                }
            }
        }

        for (let i = 0; i < forgeRows1.length; i++) {
            forgeRows1[i] = (forgeRows1[i] - 4 * pixelWidth) / pixelWidth;
            forgeCols1[i] = (forgeCols1[i] - forgeColRanges[i][0] * pixelWidth) / pixelWidth;
        }

        let forgeRows2 = [0, 0, 0];
        let forgeCols2 = [0, 0, 0];

        for (let i = 0; i < forgeColRanges.length; i++) {
          for (let col = aCol + forgeColRanges[i][1] * pixelWidth - 1; col >= aCol + forgeColRanges[i][0] * pixelWidth; col--) {
            for (let row = aRow + 4 * pixelWidth; row < aRow + 14 * pixelWidth; row++) {
              let pixel = this.getPixel(imgData, row * img.width + col);
              if (pixel[0] > 100 && pixel[1] > 100 && pixel[2] > 100) {
                forgeRows2[i] = row;
                forgeCols2[i] = col;
                break;
              }
            }
            if (forgeRows2[i] !== 0) {
              break;
            }
          }
        }

        for (let i = 0; i < forgeRows2.length; i++) {
            forgeRows2[i] = (forgeRows2[i] - 4 * pixelWidth) / pixelWidth;
            forgeCols2[i] = (forgeCols2[i] - forgeColRanges[i][0] * pixelWidth) / pixelWidth;
        }

        let forgeRows3 = [0, 0, 0];
        let forgeCols3 = [0, 0, 0];

        for (let i = 0; i < forgeColRanges.length; i++) {
          for (let col = aCol + forgeColRanges[i][0] * pixelWidth; col < aCol + forgeColRanges[i][1] * pixelWidth; col++) {
            for (let row = aRow + 14 * pixelWidth - 1; row >= aRow + 4 * pixelWidth; row--) {
              let pixel = this.getPixel(imgData, row * img.width + col);
              if (pixel[0] > 100 && pixel[1] > 100 && pixel[2] > 100) {
                forgeRows3[i] = row;
                forgeCols3[i] = col;
                break;
              }
            }
            if (forgeRows3[i] !== 0) {
              break;
            }
          }
        }

        for (let i = 0; i < forgeRows3.length; i++) {
            forgeRows3[i] = (forgeRows3[i] - 4 * pixelWidth) / pixelWidth;
            forgeCols3[i] = (forgeCols3[i] - forgeColRanges[i][0] * pixelWidth) / pixelWidth;
        }

        let forgeDirections = forgeRows1.map((_, i) => {
          let rowDiff = forgeRows2[i] - forgeRows1[i];
          let colDiff = forgeCols2[i] - forgeCols1[i];
          return { rowDiff, colDiff };
        });

        let forgeRatio = forgeDirections.map((direction) => {
          return direction.rowDiff / direction.colDiff;
        });

        let forgeBackupDirections = forgeRows2.map((_, i) => {
          let rowDiff = forgeRows3[i] - forgeRows2[i];
          let colDiff = forgeCols3[i] - forgeCols2[i];
          return { rowDiff, colDiff };
        });

        let forgeBackupRatio = forgeBackupDirections.map((direction) => {
          return direction.rowDiff / direction.colDiff;
        });


        const lowResRatioPairs = {
          '0.23': -1,
          '0.21': 13,
          '0.176': 16
        };

        const highResRatioPairs = {
          '0.26': -1,
          '0.15': 13,
          '0.12': 16
        };

        const lowResRatioPairsBackup = {
          '-0.23': -15,
          '-0.29': 2,
          '-0.69': 7
        };

        const highResRatioPairsBackup = {
          '-0.16': -15,
          '-0.36': 2,
          '-0.79': 7
        };


        let forgeIcons = [0, 0, 0];

        let ratioPairs;
        for (let i = 0; i < 3; i++) {
          let backup = forgeRatio[i] === 0;
          let ratioToUse = backup ? forgeBackupRatio[i] : forgeRatio[i];

          if (pixelWidth === 2) {
            ratioPairs = backup ? lowResRatioPairsBackup : lowResRatioPairs;
          } else {
            ratioPairs = backup ? highResRatioPairsBackup : highResRatioPairs;
          }
          forgeIcons[i] = this.findClosestIcon(ratioPairs, ratioToUse);
        }


        for (let i = 0; i < forgeRows1.length; i++) {
          if (forgeRows1[i] <= 0) {
            forgeIcons[i] = 0;
          }
        }

        let forgeGuide : number[][] = [
          [0,0,0],
          [0,0,0],
          [0,0,0]
        ];

        for (let i = 0; i < 3; i++) {
          let first = this.getPixel(imgData, (aRow + 17*pixelWidth) * img.width + aCol + 52 * pixelWidth + i*19*pixelWidth);
          let second = this.getPixel(imgData, (aRow + 19*pixelWidth) * img.width + aCol + 52 * pixelWidth + i*19*pixelWidth);
          let last = this.getPixel(imgData,(aRow + 21*pixelWidth) * img.width + aCol + 52 * pixelWidth + i*19*pixelWidth);
          forgeGuide[i][0] = first[0] == 216 && first[1] == 86 && first[2] == 0 ? 1 : 0;
          forgeGuide[i][1] = second[0] == 216 && second[1] == 86 && second[2] == 0 ? 1 : 0;
          forgeGuide[i][2] = last[0] == 216 && last[1] == 86 && last[2] == 0 ? 1 : 0;
        }

        let originalDistance = distance;
        let lastMoves = [0, 0, 0];

        let forgeGuideOrder = [0,1,2];




        for (let i = 0; i < 3; i++) {
          if (forgeGuide[i][2] == 1 && forgeGuide[i][1] == 0 && forgeGuide[i][0] == 0) {
            forgeGuideOrder = [i, ...forgeGuideOrder.filter((_, index) => index !== i)];
            break;
          }
          if (forgeGuide[i][2] == 0 && forgeGuide[i][1] == 1 && forgeGuide[i][0] == 1) {
            forgeGuideOrder = [...forgeGuideOrder.filter((_, index) => index !== i), i];
            break;
          }
        }

        if (forgeGuide[forgeGuideOrder[0]][2] == 1) {
          if (forgeIcons[forgeGuideOrder[0]] == -1) {
            let bestOption0 = this.findBestOption(distance);
            distance -= bestOption0;
            lastMoves[0] = bestOption0;
          } else {
            distance -= forgeIcons[forgeGuideOrder[0]];
            lastMoves[0] = forgeIcons[forgeGuideOrder[0]];
          }
          if (forgeGuide[forgeGuideOrder[1]][1] == 1 && forgeIcons[forgeGuideOrder[1]] == -1) {
            let bestOption1 = this.findBestOption(distance);
            distance -= bestOption1;
            lastMoves[1] = bestOption1;
          } else {
            distance -= forgeIcons[forgeGuideOrder[1]];
            lastMoves[1] = forgeIcons[forgeGuideOrder[1]];
          }
          if (forgeGuide[forgeGuideOrder[2]][0] == 1 && forgeIcons[forgeGuideOrder[2]] == -1) {
            let bestOption2 = this.findBestOption(distance);
            distance -= bestOption2;
            lastMoves[2] = bestOption2;
          } else {
            distance -= forgeIcons[forgeGuideOrder[2]];
            lastMoves[2] = forgeIcons[forgeGuideOrder[2]];
          }
        }

        let [_, moves] = this.minStepsToN(distance);

        lastMoves = lastMoves.filter((move) => move !== 0);
        moves.push(...lastMoves.reverse());
        console.log("Moves: " + moves);

        // sum of moves
        let sum = 0;
        for (let i = 0; i < moves.length; i++) {
          sum += moves[i];
        }
        let validationCheck = sum == originalDistance;

        console.log("validation check: " + validationCheck);
        this.forgeText.set(moves.map((move) => move.toString()));


        ctx.putImageData(imgData, 0, 0);  // 0,0 is xy coordinates
        this.imageUrl = canvas.toDataURL();
      }

      img.src = this.imageUrl;

      return;
    } catch (e) {
      console.log(e);
      console.log("Error processing image");
      this.errorModal.nativeElement.showModal();
      this.imageUrl = "";
    }
  }

  findClosestIcon(dict: { [key: string]: number }, input: number): number {
  let closestKey = Object.keys(dict)[0]; // Start with the first key
  let minDifference = Math.abs(input - Number(closestKey));

  // Loop through all keys in the dictionary
  for (let key of Object.keys(dict)) {
    let diff = Math.abs(input - Number(key));
    if (diff < minDifference) {
      closestKey = key;
      minDifference = diff;
    }
  }

  return dict[Number(closestKey)];
}

  getPixel(imgData : ImageData, index : number) {
    return imgData.data.subarray(index*4, index*4+4); // Uint8ClampedArray(4) [R,G,B,A]
  }

  setPixel(imgData : ImageData, index : number, pixelData : number[] /*[R,G,B,A]*/) {
    imgData.data.set(pixelData, index*4);
  }

  findBestOption(startDistance: number): number {
    let bestOption = 0;
    let bestSteps = 1000;
    const forgeOptions = [-3, -6, -9];

    for (let i = 0; i < 3; i++) {
      let testDistance = startDistance - forgeOptions[i];
      let [steps,_] = this.minStepsToN(testDistance);
      if (steps < bestSteps) {
        bestOption = forgeOptions[i];
        bestSteps = steps;
      }
    }

    return bestOption;
  }

  minStepsToN(n: number): [number, number[]] {
    const moves = [-15, -9, -6, -3, 2, 7, 13, 16];
    const maxLimit = 150;
    n = Math.round(n);
    type State = { sum: number, steps: number, path: number[] };
    const queue: State[] = [{ sum: 0, steps: 0, path: [] }];
    const visited = new Set<number>([0]);

    while (queue.length > 0) {
        const { sum, steps, path } = queue.shift()!;

        if (sum === n) {
            // console.log(`Steps: ${steps}`);
            // console.log(`Path: ${path.join(" → ")}`);
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
