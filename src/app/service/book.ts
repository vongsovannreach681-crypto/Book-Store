import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

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
    return this.http.get<Product[] | null>(this.apiUrl).pipe(map((products) => products ?? []));
  }

  getProductById(id: number): Observable<Product | null> {
    return this.http.get<Product | null>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: ProductFormValue, imageFile: File): Observable<Product | null> {
    return this.http.post<Product | null>(this.apiUrl, this.buildFormData(product, imageFile));
  }

  updateProduct(id: number, product: ProductFormValue, imageFile: File): Observable<Product | null> {
    return this.http.put<Product | null>(`${this.apiUrl}/${id}`, this.buildFormData(product, imageFile));
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
