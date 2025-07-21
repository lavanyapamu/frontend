import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  imports: [RouterModule],
  standalone:true,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  currentView: string = 'artworks';
  cartItems: any[] = [];
  wishlistItems: any[] = [];

  constructor(private router: Router) {}

  setActiveView(view: string): void {
    this.currentView = view;
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    this.router.navigate(['/login']);
}
}
