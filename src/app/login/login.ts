import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService, LoginRequest } from '../service/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  form: LoginRequest = {
    email: '',
    password: '',
  };

  error = '';
  success = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  submit(): void {
    this.error = '';
    this.success = '';
    this.loading = true;

    const payload: LoginRequest = {
      email: this.form.email.trim(),
      password: this.form.password,
    };

    if (!payload.email || !payload.password) {
      this.error = 'Email and password are required.';
      this.loading = false;
      return;
    }

    this.authService.login(payload).subscribe({
      next: (response) => {
        this.authService.storeAuth(response, {
          email: payload.email,
        });
        this.success = response.message ?? 'Login successful.';
        this.loading = false;
        this.router.navigate(['/books']);
      },
      error: () => {
        this.error = 'Could not log in. Please check your credentials and try again.';
        this.loading = false;
      },
    });
  }
}
