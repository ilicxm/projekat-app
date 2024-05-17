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
  phone: string;
  email: string;
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
  customer: Customer = { name: '', surname: '', address: '', phone: '', email:'' };
  paymentMethod: string = 'invoice';
  creditCard: CreditCard = { number: '', cvc: '', cardholderName: '', expiryDate: '' };
  deliveryDate: string = new Date().toISOString();
  userEmail: string = '';

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
    if (!this.customer.email) {
      console.error('User email not provided');
      return;
    }

    this.orderService.placeOrder(this.cartItems, this.customer, this.paymentMethod, this.deliveryDate, this.customer.email) // Prosleđujemo this.customer.email
      .subscribe(
        response => {
          console.log('Order placed successfully', response);
          this.router.navigate(['/confirm']);
        },
        error => {
          console.error('Error placing order', error);

        }
      );
  }
}
