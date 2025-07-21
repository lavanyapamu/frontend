import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidenavComponent } from './sidenav/sidenav.component';

@Component({
  selector: 'app-buyer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidenavComponent],
  templateUrl: './buyer-dashboard.component.html',
  styleUrls: ['./buyer-dashboard.component.css']
})
export class BuyerDashboardComponent implements OnInit {

  user_id: string = '';
  cartItems: any[] = [];
  wishlistItems: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.user_id = localStorage.getItem('user_id') || '';
    
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    this.router.navigate(['/login']);
  }
}
