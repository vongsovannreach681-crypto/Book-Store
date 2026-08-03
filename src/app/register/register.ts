import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService, RegisterRequest } from '../service/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  form = {
    userName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  };
  selectedProfileImage: File | null = null;
  profilePreviewUrl = '';

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

    const payload: RegisterRequest = {
      userName: this.form.userName.trim(),
      email: this.form.email.trim(),
      phone: this.form.phone.trim(),
      password: this.form.password,
      profileImage: this.selectedProfileImage,
    };

    if (!payload.userName || !payload.email || !payload.phone || !payload.password) {
      this.error = 'User name, email, phone, and password are required.';
      this.loading = false;
      return;
    }

    if (payload.password !== this.form.confirmPassword) {
      this.error = 'Passwords do not match.';
      this.loading = false;
      return;
    }

    this.authService.register(payload).subscribe({
      next: (response) => {
        this.authService.storeAuth(response, {
          userName: payload.userName,
          email: payload.email,
          phone: payload.phone,
        });
        this.success = response.message ?? 'Registration successful. Redirecting to login...';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 800);
      },
      error: () => {
        this.error = 'Could not create your account. Please try again.';
        this.loading = false;
      },
    });
  }

  onProfileImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.selectedProfileImage = file;
    this.profilePreviewUrl = file ? URL.createObjectURL(file) : '';
  }
}
