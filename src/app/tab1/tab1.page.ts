import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor() {}

  // Definisanje metode showDetails
  showDetails(category: string) {
    console.log('Showing details for category:', category);
    // Implementacija logike za prikaz detalja za određenu kategoriju
  }

  // Definisanje metode showCakeDetails
  showCakeDetails(cakeName: string) {
    console.log('Showing details for cake:', cakeName);
    // Implementacija logike za prikaz detalja za određeni kolač
  }
}



