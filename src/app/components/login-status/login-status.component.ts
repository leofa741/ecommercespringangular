import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import { CartService } from 'src/app/services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string = '';
  storage: Storage = sessionStorage;
  storagecart: Storage = localStorage;
  constructor(
    private oktaAuthService: OktaAuthStateService, 
    @Inject(OKTA_AUTH) private oktaAuth:OktaAuth,
    private router: Router,
    private cartservice: CartService
     ) { }

  ngOnInit(): void {
    // subscribe to authentication state changes
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    )
  }
  getUserDetails() {
    if(this.isAuthenticated) {
      // fetch the logged in user details (user's claims)
      // user full name is exposed as a property name
      this.oktaAuth.getUser().then(
        (res) => {
          this.userFullName = res.name as string;
          let theEmail = res.email as string;
          this.storage.setItem('userEmail', JSON.stringify(theEmail));      

        
          
        }
        
      )
    }
  }



  logout() {
    // Terminates the session with Okta and removes current tokens.
    this.oktaAuth.signOut();  
    // reset cart

    this.clearCart();

    this.storagecart.clear();
   
   
   Swal .fire({
    title: 'Logout',
    text: 'You have been logged out',
    icon: 'success',
    showCancelButton: false,
    confirmButtonText: 'OK',
    confirmButtonColor: '#3085d6',
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false
  }).then((result) => {
    if (result.isConfirmed) {
      this.router.navigateByUrl('/home');

    }
  })

}

clearCart() {
  this.cartservice.clear();
  this.cartservice.totalPrice.next(0);
  this.cartservice.totalQuantity.next(0);
  this.router.navigateByUrl('/home');
}



}


