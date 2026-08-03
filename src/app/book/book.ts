import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { BookService, Product, ProductFormValue } from '../service/book';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book.html',
  styleUrl: './book.css',
})
export class Book implements OnInit {
  products: Product[] = [];
  searchTerm = '';
  selectedCategory = 'All';
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  categories: string[] = [];
  error = '';
  modalOpen = false;
  detailOpen = false;
  isEditing = false;
  productForm: Product = this.createEmptyProduct();
  selectedProduct: Product | null = null;
  selectedImageFile: File | null = null;
  imagePreviewUrl = '';
  saving = false;
  deletingIds = new Set<number>();

  constructor(
    private bookService: BookService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.bookService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.refreshCategoryState();
      },
      error: () => {
        this.products = [];
        this.categories = [];
        this.selectedCategory = 'All';
        this.currentPage = 1;
        this.totalPages = 1;
      },
    });
  }

  filteredProducts(): Product[] {
    const term = this.searchTerm.trim().toLowerCase();

    const filtered = this.products.filter((product) => {
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term);

      const matchesCategory =
        this.selectedCategory === 'All' || product.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });

    this.totalPages = Math.max(1, Math.ceil(filtered.length / this.pageSize));

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filtered.slice(startIndex, startIndex + this.pageSize);
  }

  updateTotalPages(): void {
    this.totalPages = Math.max(1, Math.ceil(this.filteredProducts().length / this.pageSize));
  }

  trackByProductId(_: number, product: Product): number {
    return product.id;
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.productForm = this.createEmptyProduct();
    this.selectedImageFile = null;
    this.imagePreviewUrl = '';
    this.modalOpen = true;
  }

  openEditModal(id: number): void {
    this.error = '';
    this.bookService.getProductById(id).subscribe({
      next: (product) => {
        this.isEditing = true;
        this.productForm = { ...product };
        this.selectedImageFile = null;
        this.imagePreviewUrl = product.imageUrl;
        this.modalOpen = true;
      },
      error: () => {
        this.error = 'Could not load the product for editing.';
      },
    });
  }

  closeModal(): void {
    this.modalOpen = false;
    this.productForm = this.createEmptyProduct();
    this.selectedImageFile = null;
    this.imagePreviewUrl = '';
    this.isEditing = false;
  }

  viewProduct(id: number): void {
    this.router.navigate(['/books', id]);
  }

  closeDetailModal(): void {
    this.detailOpen = false;
    this.selectedProduct = null;
  }

  async saveProduct(): Promise<void> {
    this.error = '';
    this.saving = true;
    const payload: ProductFormValue = {
      name: this.productForm.name.trim(),
      qty: Number(this.productForm.qty),
      price: Number(this.productForm.price),
      description: this.productForm.description.trim(),
      category: this.productForm.category.trim(),
      imageUrl: this.productForm.imageUrl.trim(),
    };

    if (!payload.name || !payload.category) {
      this.error = 'Name and category are required.';
      this.saving = false;
      return;
    }

    let imageFile = this.selectedImageFile;

    if (!imageFile) {
      this.error = 'Please choose an image file before saving.';
      this.saving = false;
      return;
    }

    if (this.isEditing && this.productForm.id) {
      this.bookService.updateProduct(this.productForm.id, payload, imageFile).subscribe({
        next: (updatedProduct) => {
          this.upsertProduct(updatedProduct);
          this.closeModal();
          this.saving = false;
        },
        error: () => {
          this.error = 'Could not update the product. Please try again.';
          this.saving = false;
        },
      });
      return;
    }

    this.bookService.createProduct(payload, imageFile).subscribe({
      next: (createdProduct) => {
        this.products = [createdProduct, ...this.products];
        this.refreshCategoryState();
        this.closeModal();
        this.saving = false;
      },
      error: () => {
        this.error = 'Could not save the product. Please try again.';
        this.saving = false;
      },
    });
  }

  deleteProduct(id: number): void {
    this.deletingIds.add(id);
    this.bookService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter((product) => product.id !== id);
        this.deletingIds.delete(id);
        this.refreshCategoryState();
      },
      error: () => {
        this.error = 'Could not delete the product.';
        this.deletingIds.delete(id);
      },
    });
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
  }

  onCategoryChange(): void {
    this.currentPage = 1;
  }

  private createEmptyProduct(): Product {
    return {
      id: 0,
      name: '',
      qty: 1,
      price: 0,
      description: '',
      category: '',
      imageUrl: '',
    };
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.selectedImageFile = file;
    if (file) {
      this.imagePreviewUrl = URL.createObjectURL(file);
    } else {
      this.imagePreviewUrl = this.isEditing ? this.productForm.imageUrl : '';
    }
  }

  resolveImageUrl(url: string): string {
    if (!url) {
      return '';
    }

    return url
      .replace(/^https?:\/\/localhost:7028/i, 'https://vorngsovannreach.setec24.uk')
      .replace(/^http:\/\/localhost:7028/i, 'https://vorngsovannreach.setec24.uk');
  }

  isDeleting(id: number): boolean {
    return this.deletingIds.has(id);
  }

  private upsertProduct(product: Product): void {
    const index = this.products.findIndex((item) => item.id === product.id);

    if (index === -1) {
      this.products = [product, ...this.products];
      this.refreshCategoryState();
      return;
    }

    const nextProducts = [...this.products];
    nextProducts[index] = product;
    this.products = nextProducts;
    this.refreshCategoryState(false);
  }

  private refreshCategoryState(resetPage = true): void {
    this.categories = [...new Set(this.products.map((product) => product.category).filter(Boolean))];
    this.selectedCategory =
      this.selectedCategory === 'All' || this.categories.includes(this.selectedCategory)
        ? this.selectedCategory
        : 'All';

    if (resetPage) {
      this.currentPage = 1;
    }

    this.updateTotalPages();
  }
}
