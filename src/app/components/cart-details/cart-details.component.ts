import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent  implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;


  constructor(
    private cartService: CartService
  ) { }

  ngOnInit(): void {

    this.listCartDetails();
  }
  listCartDetails() {
     
      // get a handle to the cart items
    
       this.cartItems = this.cartService.cartItems;
      
  
      // subscribe to the cart totalPrice
      this.cartService.totalPrice.subscribe(
        data => this.totalPrice = data
      );
  
      // subscribe to the cart totalQuantity
      this.cartService.totalQuantity.subscribe(
        data => this.totalQuantity = data
      );
  
      // compute cart total price and quantity
      this.cartService.computeCartTotals();
  }


  updateQuantity(cartItem: any, increment: number) {
    cartItem.quantity += increment;
  }

  decrementQuantity(cartItem: CartItem) {
    this.cartService.decrementQuantity(cartItem);
  }
  incrementQuantity (cartItem: CartItem) {
    this.cartService.addToCart(cartItem);

  }

  remove(cartItem: any) {
    this.cartService.remove(cartItem);
  }

  clear () {
    this.cartService.clear();
  }



}
