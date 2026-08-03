import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BookService, Product } from '../service/book';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  featuredBooks: Product[] = [];
  loading = true;
  error = '';

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getProducts().subscribe({
      next: (products) => {
        this.featuredBooks = products.slice(0, 6);
        this.loading = false;
      },
      error: () => {
        this.featuredBooks = [];
        this.error = 'Could not load featured books.';
        this.loading = false;
      },
    });
  }

  resolveImageUrl(url: string): string {
    if (!url) {
      return '';
    }

    return url
      .replace(/^https?:\/\/localhost:7028/i, 'https://vorngsovannreach.setec24.uk')
      .replace(/^http:\/\/localhost:7028/i, 'https://vorngsovannreach.setec24.uk');
  }
}
