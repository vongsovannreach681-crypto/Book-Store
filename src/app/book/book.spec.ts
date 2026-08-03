import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Book } from './book';
import { BookService, Product } from '../service/book';

describe('Book', () => {
  let component: Book;
  let fixture: ComponentFixture<Book>;
  let service: jasmine.SpyObj<BookService>;

  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Glow Serum',
      qty: 8,
      price: 19.99,
      description: 'Hydrating serum',
      category: 'Beauty',
      imageUrl: 'https://example.com/serum.jpg',
    },
    {
      id: 2,
      name: 'Running Shoes',
      qty: 12,
      price: 55,
      description: 'Sport shoes',
      category: 'Sport',
      imageUrl: 'https://example.com/shoes.jpg',
    },
  ];

  beforeEach(async () => {
    service = jasmine.createSpyObj<BookService>('BookService', [
      'getProducts',
      'createProduct',
      'updateProduct',
      'deleteProduct',
    ]);
    service.getProducts.and.returnValue(of(mockProducts));

    await TestBed.configureTestingModule({
      imports: [Book],
      providers: [{ provide: BookService, useValue: service }],
    }).compileComponents();

    fixture = TestBed.createComponent(Book);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter products by category and search text', () => {
    component.products = mockProducts;
    component.searchTerm = 'glow';
    component.selectedCategory = 'Beauty';

    const filtered = component.filteredProducts();

    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Glow Serum');
  });
});
