// checkout.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Customer } from '../checkout/checkout.page'; // Adjust the path if needed
@Injectable({
  providedIn: 'root'
})

export class OrderService {
  private baseUrl = 'http://localhost:3000'; // Server URL

  constructor(private http: HttpClient) { }

  placeOrder(cartItems: Product[], customer: Customer, paymentMethod: string, deliveryDate: string): Observable<any> {
    const orderData = {
      cartItems,
      customer,
      paymentMethod,
      deliveryDate
    };
    return this.http.post(`${this.baseUrl}/checkout`, orderData);
  }
}
