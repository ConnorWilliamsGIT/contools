import {Component} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  pageName: string;

  constructor(private route: ActivatedRoute) {
    this.pageName = this.route.snapshot.data['pageName'];
  }
}
