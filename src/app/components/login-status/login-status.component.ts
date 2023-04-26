import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;

  userFullName: string = '';

  constructor(
    private oktaAuthService: OktaAuthStateService, 
    @Inject(OKTA_AUTH) private oktaAuth:OktaAuth,
    private router: Router
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
          console.log(res);
        }
        
      )
    }
  }

  logout() {
    // Terminates the session with Okta and removes current tokens.
    this.oktaAuth.signOut();

   

    this.router.navigateByUrl('/home');





  }
  

}
