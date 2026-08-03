import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from './service/auth';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('E-commerce');
  protected readonly menuOpen = signal(false);
  protected readonly currentUser = computed(() => this.authService.currentUser());

  constructor(
    protected readonly authService: AuthService,
    private router: Router,
  ) {}

  protected toggleMenu(): void {
    this.menuOpen.update((value) => !value);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected logout(): void {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/']);
  }

  protected getDisplayName(): string {
    return this.authService.getDisplayName();
  }

  protected getAvatarUrl(): string {
    return this.authService.getAvatarUrl();
  }
}
