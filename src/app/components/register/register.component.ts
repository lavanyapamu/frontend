import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';  // Import HttpClient
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  selectedRole: string = 'buyer';

  user = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer', 
    isVerified: false
  };

  constructor(private router: Router, private http: HttpClient, private authService: AuthService,) {} 

  selectRole(role: string) {
    this.selectedRole = role;
    this.user.role = role;
  }

  onSubmit() {
    if (this.user.password !== this.user.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

   
    const payload = {
      full_name: this.user.fullName,
      email: this.user.email,
      password: this.user.password,
      role_name: this.user.role 
    };

    
    this.http.post('http://localhost:5000/register', payload)
      .subscribe({
        next: (response: any) => {
          alert("Registered successfully! Please check your email to verify your account.");
         
        },
        error: (error) => {
          console.error(error);
          alert("Registration failed. Please try again.");
        }
      });
  }
  
  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      const role = localStorage.getItem('role_id');
      if (role === '2') {
        this.router.navigate(['/artistd/artist'], { replaceUrl: true });
      } else if (role === '3') {
        this.router.navigate(['/buyerdashboard'], { replaceUrl: true });
      } else {
        this.router.navigate(['/main/home'], { replaceUrl: true });
      }
    }
  }
  goToLogin() {
    this.router.navigate(['/login'],  { replaceUrl: true });
  }
}
  

