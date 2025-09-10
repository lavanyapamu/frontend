import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} 
from '@angular/router';
import { AuthService } from '../components/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const expectedRole = route.data['role']; // from route data
    const roleId = localStorage.getItem('role_id');

    if (roleId && +roleId === expectedRole) {
      return true;
    }

    return this.router.createUrlTree(['/main/home']); // unauthorized redirect
  }
}
