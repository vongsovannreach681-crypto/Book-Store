import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  qty: number;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
}

export interface ProductFormValue {
  name: string;
  qty: number;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly apiUrl = 'https://vorngsovannreach.setec24.uk/api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: ProductFormValue, imageFile: File): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, this.buildFormData(product, imageFile));
  }

  updateProduct(id: number, product: ProductFormValue, imageFile: File): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, this.buildFormData(product, imageFile));
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private buildFormData(product: ProductFormValue, imageFile: File): FormData {
    const formData = new FormData();
    formData.append('Name', product.name ?? '');
    formData.append('Qty', String(product.qty ?? 0));
    formData.append('Price', String(product.price ?? 0));
    formData.append('Description', product.description ?? '');
    formData.append('Category', product.category ?? '');
    formData.append('ImageUrl', imageFile, imageFile.name);
    return formData;
  }
}
