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

  placeOrder(cartItems: Product[], customer: Customer, paymentMethod: string, deliveryDate: string, userEmail: string): Observable<any> {
    const orderData = {
      cartItems,
      customer,
      paymentMethod,
      deliveryDate,
      userEmail // Dodajemo userEmail kao deo podataka o narudžbini
    };
    return this.http.post(`${this.baseUrl}/checkout`, orderData);
  }
  getOrders(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/${email}`);
  }
}


