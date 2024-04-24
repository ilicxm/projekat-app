import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Definisanje interfejsa CartItem
interface Product {
  name: string;
  description: string;
  price: string;
  image: string;
  quantity: number;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  showNotificationPopup = false;

  products: Product[] = []; // Array to hold all products
  filteredProducts: Product[] = []; // Array to hold filtered products
  cartItems: Product[] = [];

  constructor(private router: Router) {
    this.products = [
      {
        name: 'Choco Loco',
        description: 'Choco cake',
        price: '$34.00',
        image: '../../assets/Image/guglTorta.jpeg',
        quantity: 1
      },
      {
        name: 'Strawberry Shortcake',
        description: 'Cake with strawberries',
        price: '$16.99',
        image: '../../assets/Image/images.jpeg',
        quantity: 1
      },
      {
        name: 'Unicorn cake',
        description: 'Cake with unicorn',
        price: '$23.99',
        image: '../../assets/Image/torta3.jpeg',
        quantity: 1
      },
      {
        name: 'Chips Ahoy',
        description: 'Classic cookie',
        price: '$2.30',
        image: '../../assets/Image/Kuki1.jpeg',
        quantity: 1
      },
      {name: 'Oreo', description: 'Oreo cookie', price: '$1.90', image: '../../assets/Image/Kuki2.jpeg', quantity: 1},
      {
        name: 'Sprinkles',
        description: 'Colorful treats',
        price: '$2.80',
        image: '../../assets/Image/Kuki3.jpeg',
        quantity: 1
      },
      {
        name: 'Chocoloney',
        description: 'Choco muffin',
        price: '$4.50',
        image: '../../assets/Image/Mafin1.jpeg',
        quantity: 1
      },
      {
        name: 'Pistaccio Cream',
        description: 'Pistaccio muffin',
        price: '$6.00',
        image: '../../assets/Image/Mafin2.jpeg',
        quantity: 1
      },
      {
        name: 'Blueberry Bash',
        description: 'Blueberry muffin',
        price: '$2.90',
        image: '../../assets/Image/Mafin3.jpeg',
        quantity: 1
      }

    ];

    this.filteredProducts = this.products;
  }
  filterProducts(searchTerm: string) {
    // If search term is empty, display all products
    if (!searchTerm.trim()) {
      this.filteredProducts = this.products;
      return;
    }

    // Filter products based on search term
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }



  showNotification() {
    this.showNotificationPopup = true;
    setTimeout(() => {
      this.showNotificationPopup = false;
    }, 3000); // Prikazuje se 3 sekunde, nakon toga nestaje
  }





  addToCart(product: Product) {
    const existingItem = this.cartItems.find(item => item.name === product.name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({ ...product, quantity: 1 });
    }
    console.log('Product added to cart:', product);
  }
}
