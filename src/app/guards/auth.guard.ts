import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model'; // ✅ Use Enum here as well!

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      const currentPath = window.location.pathname;
      if (currentUser.role === UserRole.Manager && currentPath.includes('employee')) {
        this.router.navigate(['/manager']);
        return false;
      } else if (currentUser.role === UserRole.Employee && currentPath.includes('manager')) {
        this.router.navigate(['/employee']);
        return false;
      }
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
