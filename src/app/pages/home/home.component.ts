import { Component } from '@angular/core';
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
export class HomeComponent {

}
