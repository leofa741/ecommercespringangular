import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
 
 
  cartItems: CartItem[]= [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0); 
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

 //  storage: Storage = sessionStorage;
 storage: Storage = localStorage;



  constructor( ) {
    // read data from storage
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if (data != null) {
      this.cartItems = data;

      // compute totals based on the data that is read from storage
      this.computeCartTotals();
    }   
  }

  addToCart(theCartItem: CartItem) {
      
      // check if we already have the item in our cart
      let alreadyExistsInCart: boolean = false;
      let existingCartItem: CartItem = undefined!;
  
      if (this.cartItems.length > 0) {
  
        // find the item in the cart based on item id
        existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id)!;
  
        // check if we found it
        alreadyExistsInCart = (existingCartItem != undefined);
      }
  
      if (alreadyExistsInCart) {
        // increment the quantity
        existingCartItem.quantity++;
      }
      else {
        // just add the item to the array
        this.cartItems.push(theCartItem); 
      }
  
      // compute cart total price and total quantity
      this.computeCartTotals();
    }
  computeCartTotals() {
    
        let totalPriceValue: number = 0;
        let totalQuantityValue: number = 0;
    
        for (let currentCartItem of this.cartItems) {
          totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
          totalQuantityValue += currentCartItem.quantity;
        }
    
        // publish the new values ... all subscribers will receive the new data
        this.totalPrice.next(totalPriceValue);
        this.totalQuantity.next(totalQuantityValue);
    
        // log cart data just for debugging purposes
        this.logCartData(totalPriceValue, totalQuantityValue);
        
        // persist cart data

        this.persistCartItems();

      }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
      
          console.log('Contents of the cart');
      
          for (let tempCartItem of this.cartItems) {
            const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
            console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
          }
      
          console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
          console.log('---');
        }


        remove(cartItem: any) {
          const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === cartItem.id);
      
          if (itemIndex > -1) {
            this.cartItems.splice(itemIndex, 1);
      
            this.computeCartTotals();
          }
        }

        clear() {
          this.cartItems = [];
          this.totalPrice.next(0);
          this.totalQuantity.next(0);
        }
        decrementQuantity(cartItem: CartItem) {
          cartItem.quantity--;
      
          if (cartItem.quantity === 0) {
            this.remove(cartItem);
          }
          else {
            this.computeCartTotals();
          }
        }     
        
        persistCartItems() {
          this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
        }

        updateCart(cart: any) {
          this.cartItems = cart;
          this.computeCartTotals();
        }
        


  }


  




 