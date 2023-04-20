import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { ProductCategory } from 'src/app/common/product-category';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent  implements OnInit {

  products: Product[]= [];
  currentCategoryId: number = 1;  
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  thePageNumber: number = 1;
  thePageSize: number = 6;
  theTotalElements: number = 1;



  constructor(
    private cartService: CartService,
    private productService: ProductService,   
    private route : ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });

    this.listProducts();

    
  }
  listProducts() {
  

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
   
  }

  

  handleListProducts( ) {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
    }

    // check if we have a different category than previous
    // note: Angular will reuse a component if it is currently being viewed
    // if we have a different category id than previous
    // then set thePageNumber back to 1

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);
    
    // now get the products for the given category id
    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                                this.thePageSize,
                                                this.currentCategoryId).subscribe(
                                                  data => {
                                                    this.products = data._embedded.products;
                                                    this.thePageNumber = data.page.number + 1;
                                                    this.thePageSize = data.page.size;
                                                    this.theTotalElements = data.page.totalElements;
                                                  }
                                                );
  }
  
  
    


    handleSearchProducts() {
      const keyword: string = this.route.snapshot.paramMap.get('keyword')!; 

     if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;    
      // now search for the products using keyword
      this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                                  this.thePageSize,     
                                                  keyword).subscribe(
                                                    data => {
                                                      this.products = data._embedded.products;
                                                      this.thePageNumber = data.page.number + 1;
                                                      this.thePageSize = data.page.size;
                                                      this.theTotalElements = data.page.totalElements;
                                                    }
                                                  );
    }    

    updatePageSize(pageSize: string) {
      this.thePageSize = +pageSize;
      this.thePageNumber = 1;
      this.listProducts();
    }
    
    
    addToCart(theProduct: Product) {
      console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

      const theCartItem = new CartItem(theProduct);
      this.cartService.addToCart(theCartItem);
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

