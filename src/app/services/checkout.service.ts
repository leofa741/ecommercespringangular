import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { Customer } from '../common/customer';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  

  private baseUrl = 'https://ecommercespringback.vercel.app/api/checkout/purchase';



  constructor(
    private httpClient: HttpClient
  ) { }

  placeOrder(purchase: Purchase ):Observable<any> {
    return this.httpClient.post<Purchase>(this.baseUrl, purchase);
  }

}
