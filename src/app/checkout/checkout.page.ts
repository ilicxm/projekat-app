import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// Interface for product details
interface Product {
  name: string;
  description: string;
  price: string;
  image: string;
  quantity: number;
}

// Interface for customer details
interface Customer {
  name: string;
  surname: string;
  address: string;
  email: string;
  phone: string;
}

// Interface for credit card details
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
export class CheckoutPage {

  cartItems: Product[] = []; // Define cartItems array
  customer: Customer = { name: '', surname: '', address: '', email: '', phone: '' };
  paymentMethod: string = 'invoice'; // Default payment method
  creditCard: CreditCard = { number: '', cvc: '', cardholderName: '', expiryDate: '' }; // Credit card details
  deliveryDate: string;

  constructor(private router: Router, private route: ActivatedRoute) {
    // Retrieve cart items from query params
    this.deliveryDate = new Date().toISOString();
    this.route.queryParams.subscribe(params => {
      if (params && params['cartItems']) { // Accessing using square brackets
        this.cartItems = JSON.parse(params['cartItems']); // Accessing using square brackets
      }
    });
  }

  getTotalPrice(): number {
    // Implementation for calculating total price
    return this.cartItems.reduce((total, item) => {
      return total + (parseFloat(item.price.replace('$', '')) * item.quantity);
    }, 0);
  }

  navigateToTab2() {
    // Implementation for navigating to Tab2 page
    this.router.navigate(['/tabs/tab2']);
  }

  decreaseQuantity(item: Product) {
    // Implementation for decreasing quantity of an item
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  increaseQuantity(item: Product) {
    // Implementation for increasing quantity of an item
    item.quantity++;
  }

  removeFromCart(item: Product) {
    // Implementation for removing an item from the cart
    const index = this.cartItems.indexOf(item);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
    }
  }
}
