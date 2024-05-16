import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from '../services/checkout.services';

export interface Product {
  name: string;
  description: string;
  price: string;
  image: string;
  quantity: number;
}

export interface Customer {
  name: string;
  surname: string;
  address: string;
  email: string;
  phone: string;
}

interface CreditCard {
  number: string;
  cvc: string;
  cardholderName: string;
  expiryDate: string;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  cartItems: Product[] = [];
  customer: Customer = { name: '', surname: '', address: '', email: '', phone: '' };
  paymentMethod: string = 'invoice';
  creditCard: CreditCard = { number: '', cvc: '', cardholderName: '', expiryDate: '' };
  deliveryDate: string = new Date().toISOString();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params['cartItems']) {
        this.cartItems = JSON.parse(params['cartItems']);
      }
    });

    // Učitavanje e-pošte iz sessionStorage
    const storedEmail = sessionStorage.getItem('email');
    if (storedEmail) {
      this.customer.email = storedEmail;
    }
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (parseFloat(item.price.replace('$', '')) * item.quantity);
    }, 0);
  }

  navigateToTab2() {
    this.router.navigate(['/tabs/tab2']);
  }

  decreaseQuantity(item: Product) {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  increaseQuantity(item: Product) {
    item.quantity++;
  }

  removeFromCart(item: Product) {
    const index = this.cartItems.indexOf(item);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
    }
  }

  placeOrder() {
    // Ažuriranje customer.email ako je prazan
    if (!this.customer.email) {
      const storedEmail = sessionStorage.getItem('email');
      if (storedEmail) {
        this.customer.email = storedEmail;
      }
    }

    // Prosleđivanje e-pošte sačuvane u sessionStorage
    this.orderService.placeOrder(this.cartItems, this.customer, this.paymentMethod, this.deliveryDate)
      .subscribe(
        response => {
          console.log('Order placed successfully', response);
          this.router.navigate(['/confirm']);
        },
        error => {
          console.error('Error placing order', error);
          // Handle error response
        }
      );
  }

}






