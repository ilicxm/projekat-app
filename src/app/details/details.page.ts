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



