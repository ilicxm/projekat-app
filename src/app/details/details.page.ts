import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { CakeDetailsComponent } from '../cake-details/cake-details.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss']
})
export class DetailsPage {

  constructor(public popoverController: PopoverController) {}

  async showDetails(itemType: string, itemName: string) {
    console.log('Showing details for', itemType, ':', itemName);

    let details = '';
    if (itemType === 'cake') {
      if (itemName === 'Choco Loco') {
        details = `Choco Loco is our newest creation with chocolate and hazelnut cream.`;
      } else if (itemName === 'Strawberry Shortcake') {
        details = `Indulge in the freshness of strawberries with our Strawberry Shortcake.`;
      } else if (itemName === 'Dream cake') {
        details = `Experience the dreaminess of our Dream Cake, made with love and passion.`;
      }
    } else if (itemType === 'cookie') {
      if (itemName === 'Chips Ahoy') {
        details = `Enjoy the crunchiness of Chips Ahoy cookies with every bite.`;
      } else if (itemName === 'Oreo') {
        details = `Delight in the creamy center of Oreo cookies, perfect for all ages.`;
      } else if (itemName === 'Sprinkles') {
        details = `Add a dash of joy to your day with our Sprinkles cookies.`;
      }
    } else if (itemType === 'muffin') {
      if (itemName === 'Chocoloney') {
        details = `Savor the richness of chocolate with our Chocoloney muffin.`;
      } else if (itemName === 'Pistaccio Cream') {
        details = `Indulge in the creamy goodness of our Pistaccio Cream muffin.`;
      } else if (itemName === 'Blueberry Bash') {
        details = `Experience the burst of flavor with our Blueberry Bash muffin.`;
      }
    }

    const popover = await this.popoverController.create({
      component: CakeDetailsComponent,
      componentProps: {
        cakeName: itemName,
        details: details
      },
      translucent: true
    });

    return await popover.present();
  }
}



