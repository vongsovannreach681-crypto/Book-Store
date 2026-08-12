import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { BookService, Product } from '../service/book';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  books: Product[] = [];
  searchTerm = '';
  selectedCategory = 'All';
  loading = true;
  error = '';

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getProducts().subscribe({
      next: (products) => {
        this.books = products;
        this.selectedCategory = 'All';
        this.loading = false;
      },
      error: () => {
        this.books = [];
        this.error = 'Could not load books.';
        this.loading = false;
      },
    });
  }

  get categories(): string[] {
    return ['All', ...new Set(this.books.map((book) => book.category).filter(Boolean)).values()];
  }

  get filteredBooks(): Product[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.books.filter((book) => {
      const matchesSearch =
        !term ||
        book.name.toLowerCase().includes(term) ||
        book.description.toLowerCase().includes(term) ||
        book.category.toLowerCase().includes(term);

      const matchesCategory =
        this.selectedCategory === 'All' || book.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  get displayBooks(): Product[] {
    return this.filteredBooks.slice(0, 4);
  }

  getRating(book: Product): number {
    return 4.2 + ((book.id ?? 0) % 5) * 0.1;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'All';
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
