import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BookService, Product } from '../service/book';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.css',
})
export class BookDetail implements OnInit {
  product: Product | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error = 'Invalid product id.';
      this.loading = false;
      return;
    }

    this.bookService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load the product details.';
        this.loading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/books']);
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
