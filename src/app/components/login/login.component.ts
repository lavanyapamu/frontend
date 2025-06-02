import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);  
        
        const decoded: any = jwtDecode(res.token);

      
        console.log('Decoded:', decoded);  

        const role_id = decoded.role_id ?? decoded.sub?.role_id;
        const user_id = decoded.user_id ?? decoded.sub?.user_id;
  
        console.log('Role ID:', role_id);
        
        localStorage.setItem('user_id', res.user_id);
        localStorage.setItem('token', res.token)
        localStorage.setItem('role_id', res.role_id);
         
        
        if (role_id === 2) {
          this.router.navigate(['/artistd/artist']);
        } else if (role_id === 3) {
          this.router.navigate(['/buyerdashboard']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.error = err.error.message || 'Login failed';
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
