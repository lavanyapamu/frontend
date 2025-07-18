import { Component } from '@angular/core';
import { RouterModule, Router  } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mainnav',
  imports: [RouterModule, CommonModule],
  templateUrl: './mainnav.component.html',
  styleUrl: './mainnav.component.css'
})
export class MainnavComponent {
  profileImageUrl: string | null = null;

  constructor(private http: HttpClient,  private router: Router) {}

  ngOnInit(): void {
    this.loadUserImage();
  }

  loadUserImage(): void {
    const token = localStorage.getItem('access_token') || '';
    const user_id = localStorage.getItem('user_id') || '';

    if (!user_id || !token) return;

    this.http.get<any>(`http://localhost:5000/api/users/${user_id}`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    }).subscribe({
      next: (user) => {
        if (user.profile_image) {
          this.profileImageUrl = `http://localhost:5000/static/uploads/${user.profile_image}?t=${Date.now()}`;
        } else {
          this.profileImageUrl = null;
        }
      },
      error: () => {
        this.profileImageUrl = null;
      } 
    });
  }

  logout(): void {
    if (confirm('Are you sure you want to log out?')) {
      localStorage.clear(); // removes all localStorage keys
      this.router.navigate(['login']);
    }
  }
  
}
