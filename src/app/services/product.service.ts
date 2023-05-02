import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../common/product';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService { 
 
  private baseUrl = 'https://ecommercespringback.vercel.app/api/products';
  private categoryUrl = 'https://ecommercespringback.vercel.app/api/product-category';

  constructor(
    private httpClient: HttpClient
  ) { }

  getProductsList( theCategoryId: number ):Observable<Product[]> {
    // need to build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);
  }

 
  getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number) : Observable<GetResponse> {
    // need to build URL based on category id, page and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponse>(searchUrl);
   
  }
  

  getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  
  getProductCategories() : Observable<ProductCategory[]> {
    
    return this.httpClient.get<GetResponseCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProductsPaginate(thePage : number, thePageSize : number, keyword: string) : Observable<GetResponse> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponse>(searchUrl);
  }
  
  getProduct(theProductId: number) : Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);

  }

  
  
}

interface GetResponse {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }

}

interface GetResponseCategory {
  _embedded: {
    productCategory : ProductCategory[];
  }
}


