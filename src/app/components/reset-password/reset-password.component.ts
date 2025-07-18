// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-reset-password',
//   imports: [],
//   templateUrl: './reset-password.component.html',
//   styleUrl: './reset-password.component.css'
// })
// export class ResetPasswordComponent {

// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  imports:[CommonModule, FormsModule, HttpClientModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})

export class ResetPasswordComponent {
  password: string = '';
  confirmPassword: string = '';
  token: string = '';
  message: string = '';
  error: string = '';
  isSubmitting = false;

  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  resetPassword(): void {
    if (this.password !== this.confirmPassword) {
      this.error = "Passwords do not match.";
      return;
    }

    this.isSubmitting = true;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    this.http.post<any>('http://localhost:5000/reset-password', {
      password: this.password
    }, { headers }).subscribe({
      next: (res) => {
        this.message = res.message;
        this.error = '';
        this.isSubmitting = false;
      },
      error: (err) => {
        this.error = err.error.message || 'Something went wrong';
        this.message = '';
        this.isSubmitting = false;
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}


