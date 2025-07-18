import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone:true,
  imports: [RouterLink,  RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  constructor( private router: Router) {}
  logout(): void {
    if (confirm('Are you sure you want to log out?')) {
      localStorage.clear(); // removes all localStorage keys
      this.router.navigate(['login']);
    }
  }
}
