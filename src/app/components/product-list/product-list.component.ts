import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent  implements OnInit {

  products: Product[]= [];
  currentCategoryId: number = 1; 
  productCategories : ProductCategory[] = [];
  searchMode: boolean = false;

  constructor(
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

  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        console.log("Product Categories: " + JSON.stringify(data));
        this.productCategories = data;
      
      }
    );
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
    }

    // now get the products for the given category id
    this.productService.getProductsList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    );

    }

    handleSearchProducts() {
      const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

      // now search for the products using keyword
      this.productService.searchProducts(keyword).subscribe(
        data => {
          this.products = data;
        }
      );
    }

    


  }

