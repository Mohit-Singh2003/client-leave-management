import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model'; // ✅ Import the Enum

@Component({
  selector: 'app-login',
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h2 class="text-center mb-4">Login</h2>
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input
                    type="text"
                    class="form-control"
                    id="username"
                    formControlName="username"
                    [ngClass]="{'is-invalid': submitted && f['username'].errors}"
                  />
                  <div *ngIf="submitted && f['username'].errors" class="error-message">
                    Username is required
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    formControlName="password"
                    [ngClass]="{'is-invalid': submitted && f['password'].errors}"
                  />
                  <div *ngIf="submitted && f['password'].errors" class="error-message">
                    Password is required
                  </div>
                </div>

                <button type="submit" class="btn btn-primary w-100 mb-3">Login</button>
                <div class="text-center">
                  <a routerLink="/signup">Don't have an account? Sign up</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authService
      .login(username, password)
      .then((isLoggedIn) => {
        if (isLoggedIn) {
          const user = this.authService.getCurrentUser();
          if (user?.role === UserRole.Manager) {
            this.router.navigate(['/manager']);
          } else if (user?.role === UserRole.Employee) {
            this.router.navigate(['/employee']);
          } else {
            console.error('Unknown role:', user?.role);
            this.router.navigate(['/login']);
          }
        } else {
          alert('Wrong credentials');
        }
      })
      .catch((error) => {
        console.error('Login failed:', error);
        alert('An error occurred during login');
      });
  }
}
