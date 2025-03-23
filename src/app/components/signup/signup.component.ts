import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model'; // ✅ Import UserRole Enum

@Component({
  selector: 'app-signup',
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h2 class="text-center mb-4">Sign Up</h2>
              <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
                <!-- Email -->
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    formControlName="email"
                    [ngClass]="{'is-invalid': submitted && f['email'].errors}"
                  >
                  <div *ngIf="submitted && f['email'].errors" class="error-message">
                    <div *ngIf="f['email'].errors['required']">Email is required</div>
                    <div *ngIf="f['email'].errors['email']">Enter a valid email</div>
                  </div>
                </div>

                <!-- Password -->
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    formControlName="password"
                    [ngClass]="{'is-invalid': submitted && f['password'].errors}"
                  >
                  <div *ngIf="submitted && f['password'].errors" class="error-message">
                    <div *ngIf="f['password'].errors['required']">Password is required</div>
                    <div *ngIf="f['password'].errors['minlength']">Password must be at least 6 characters</div>
                  </div>
                </div>

                <!-- Confirm Password -->
                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirm Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="confirmPassword"
                    formControlName="confirmPassword"
                    [ngClass]="{'is-invalid': submitted && f['confirmPassword'].errors}"
                  >
                  <div *ngIf="submitted && f['confirmPassword'].errors" class="error-message">
                    <div *ngIf="f['confirmPassword'].errors['required']">Confirm Password is required</div>
                    <div *ngIf="f['confirmPassword'].errors['passwordMismatch']">Passwords do not match</div>
                  </div>
                </div>

                <!-- Role -->
                <div class="mb-3">
                  <label for="role" class="form-label">Role</label>
                  <select
                    class="form-select"
                    id="role"
                    formControlName="role"
                    [ngClass]="{'is-invalid': submitted && f['role'].errors}"
                  >
                    <option value="">Select Role</option>
                    <option [value]="UserRole.Employee">Employee</option>
                    <option [value]="UserRole.Manager">Manager</option>
                  </select>
                  <div *ngIf="submitted && f['role'].errors" class="error-message">
                    Role is required
                  </div>
                </div>

                <button type="submit" class="btn btn-primary w-100 mb-3">Sign Up</button>
                <div class="text-center">
                  <a routerLink="/login">Already have an account? Login</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class SignupComponent {
  signupForm: FormGroup;
  submitted = false;
  UserRole = UserRole; // ✅ Binding enum to template

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  get f() {
    return this.signupForm.controls;
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    this.submitted = true;

    if (this.signupForm.invalid) {
      return;
    }

    const { email, password, role } = this.signupForm.value;

    this.authService.register(email, password, role).then((result) => {
      if (result) {
        this.router.navigate(['/login']);
      } else {
        alert('Email already in use');
      }
    }).catch((error) => {
      console.error('Registration error:', error);
      alert('An error occurred during registration');
    });
  }
}
