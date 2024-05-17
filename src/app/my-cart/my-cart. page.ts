import { Component } from '@angular/core';
import { Router } from '@angular/router';


interface Product {
  name: string;
  description: string;
  price: string;
  image: string;
  quantity: number;
}

@Component({
  selector: 'app-my-cart',
  templateUrl: 'my-cart.page.html',
  styleUrls: ['my-cart.page.scss']
})
export class MyCartPage {

  cartItems: Product[] = [];

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.cartItems = navigation.extras.state['cartItems'];

    }
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

  navigateToTab2() {
    this.router.navigateByUrl('/tabs/tab2');
  }
  navigateToCheckout() {

    this.router.navigate(['/checkout'], { queryParams: { cartItems: JSON.stringify(this.cartItems) } });
  }
  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (parseFloat(item.price.replace('$', '')) * item.quantity);
    }, 0);
  }
}

