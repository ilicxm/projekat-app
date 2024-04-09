import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { CakeDetailsComponent } from '../cake-details/cake-details.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(public popoverController: PopoverController) {}

  async showDetails(itemType: string, itemName: string) {
    console.log('Showing details for', itemType, ':', itemName);

    let details = '';
    if (itemType === 'cake') {
      if (itemName === 'Choco Loco') {
        details = `<p><strong>Choco Loco Cake</strong></p> <p>Indulge in the decadent delight of our Choco Loco cake, a heavenly creation crafted for chocolate enthusiasts. This luscious cake boasts layers of rich chocolate sponge generously filled with velvety chocolate ganache. Each bite is an explosion of intense chocolate flavor, leaving you craving for more. Whether it's a special occasion or simply a treat-yourself moment, our Choco Loco cake is sure to satisfy your sweet cravings.</p> <p><strong>Allergens:</strong> Contains wheat, dairy, and eggs.</p> <p><strong>Price per kg:</strong> $12.00</p>`;

      } else if (itemName === 'Strawberry Shortcake') {
        details = `<p><strong>Strawberry Shortcake</strong></p>
<p>Delight in the freshness of our Strawberry Shortcake, a perfect blend of fluffy cake layers, whipped cream, and juicy strawberries. Each bite offers a burst of fruity sweetness, making it an ideal treat for any occasion.</p>
<p><strong>Allergens:</strong> Contains wheat and dairy.</p>
<p><strong>Price per kg:</strong> $16.99</p>`;
      } else if (itemName === 'Dream cake') {
        details = `<p><strong>Dream Cake</strong></p>
<p>Embark on a magical journey with our Dream Cake, adorned with unicorn decorations and bursting with a medley of fruits and sprinkles. This whimsical creation is sure to enchant your taste buds with its heavenly flavors and delightful textures.</p>
<p><strong>Allergens:</strong> Contains wheat, dairy, and edible glitter.</p>
<p><strong>Price per kg:</strong> $20.00</p>`;
      }
    } else if (itemType === 'cookie') {
      if (itemName === 'Chips Ahoy') {
        details = `<p><strong>Chips Ahoy</strong></p>
<p>Enjoy the crunchiness of our Chips Ahoy cookies with every bite. These classic cookies are loaded with chocolate chips, offering a perfect balance of sweetness and texture.</p>
<p><strong>Price per piece:</strong> $2.30</p>`;
      } else if (itemName === 'Oreo') {
        details = `<p><strong>Oreo</strong></p>
<p>Delight in the creamy center of Oreo cookies, perfect for all ages. These iconic sandwich cookies feature a rich cocoa flavor and a luscious cream filling, making them a timeless treat.</p>
<p><strong>Price per piece:</strong> $1.90</p>`;
      } else if (itemName === 'Sprinkles') {
        details = `<p><strong>Sprinkles</strong></p>
<p>Add a dash of joy to your day with our Sprinkles cookies. These colorful treats are adorned with rainbow sprinkles, adding a playful touch to every bite.</p>
<p><strong>Price per piece:</strong> $2.80</p>`;
      }
    } else if (itemType === 'muffin') {
      if (itemName === 'Chocoloney') {
        details = `<p><strong>Chocoloney</strong></p>
<p>Savor the richness of chocolate with our Chocoloney muffin. This indulgent treat features a moist chocolate base topped with chocolate chips, offering a heavenly combination of flavors.</p>
<p><strong>Price per piece:</strong> $4.50</p>`;
      } else if (itemName === 'Pistaccio Cream') {
        details = `<p><strong>Pistaccio Cream</strong></p>
<p>Indulge in the creamy goodness of our Pistaccio Cream muffin. These delightful muffins are infused with pistachio flavor and filled with a luscious cream filling, creating a decadent dessert experience.</p>
<p><strong>Price per piece:</strong> $6.00</p>`;
      } else if (itemName === 'Blueberry Bash') {
        details = `<p><strong>Blueberry Bash</strong></p>
<p>Experience the burst of flavor with our Blueberry Bash muffin. Loaded with juicy blueberries and topped with a crumbly streusel topping, these muffins are a delightful treat for blueberry lovers.</p>
<p><strong>Price per piece:</strong> $2.90</p>`;
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









