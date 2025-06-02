import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-emailverify',
  imports:[CommonModule, HttpClientModule],
  templateUrl: './emailverify.component.html',
  styleUrls: ['./emailverify.component.css']
})
export class EmailverifyComponent {
  userEmail: string = '';
  isVerified: boolean = false;
  token: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      this.userEmail = params['email'] || '';
      const verified = params['verified'] === 'true';
      this.isVerified = verified;
    });
  }

  verifyEmail() {
    if (!this.token) {
      alert("Token not found!");
      return;
    }
  
    this.http.get<any>(`http://127.0.0.1:5000/emailverify/${this.token}`, { observe: 'response' })
      .subscribe({
        next: (response) => {
          console.log(" Verification Response:", response);
          this.isVerified = true;
          alert("Email verified successfully!");
        },
        error: (err) => {
          console.error("Verification failed:", err);
          alert("Verification failed: " + (err.error?.message || "Unknown error"));
          this.isVerified = false;
        }
      });
  }
  

  resendEmail() {
    alert("You need to re-register to get a new link.");
    this.router.navigate(['/register']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
