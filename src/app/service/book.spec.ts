import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BookService, Product } from './book';

describe('BookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products from the backend', () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Test Product',
        qty: 10,
        price: 15.5,
        description: 'A sample product',
        category: 'Beauty',
        imageUrl: 'https://example.com/image.jpg',
      },
    ];

    service.getProducts().subscribe((products) => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('https://vorngsovannreach.setec24.uk/api/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });
});
