import { Component } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(
    
    private router: Router
   
  ) {}
  onLogin() {
    console.log('Login clicked');
    this.router.navigate(['/login']);
  }
  
  onSignup() {
    console.log('Signup clicked');
    this.router.navigate(['/register']);
  }
}
