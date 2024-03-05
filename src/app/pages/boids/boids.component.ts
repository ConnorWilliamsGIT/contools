import { Component } from '@angular/core';
import {LayoutComponent} from "../../components/layout/layout.component";

@Component({
  selector: 'app-boids',
  standalone: true,
  imports: [
    LayoutComponent
  ],
  templateUrl: './boids.component.html',
  styleUrl: './boids.component.scss'
})
export class BoidsComponent {

}
