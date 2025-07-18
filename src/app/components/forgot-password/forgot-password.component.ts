// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-forgot-password',
//   imports: [],
//   templateUrl: './forgot-password.component.html',
//   styleUrl: './forgot-password.component.css'
// })
// export class ForgotPasswordComponent {

// }

import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports:[CommonModule, FormsModule, HttpClientModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';
  error: string = '';

  // Replace with your actual API base URL
  private apiUrl = 'http://localhost:5000/forgot-password';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.message = '';
    this.error = '';

    if (!this.email) {
      this.error = 'Please enter your email address.';
      return;
    }

    const payload = { email: this.email };

    this.http.post<any>(this.apiUrl, payload).subscribe({
      next: (response) => {
        this.message = response.message || 'A reset link has been sent to your email.';
        this.error = '';
      },
      error: (err) => {
        this.message = '';
        this.error = err.error?.message || 'Failed to send reset link. Please try again.';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
