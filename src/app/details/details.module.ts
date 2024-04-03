import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { DetailsPageRoutingModule } from './details-routing.module';
import { DetailsPage } from './details.page';

import { CakeDetailsComponent } from '../cake-details/cake-details.component'; // Uvezite CakeDetailsComponent ovde


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    DetailsPageRoutingModule,
  ],
  declarations: [DetailsPage, CakeDetailsComponent]
})
export class DetailsPageModule {}
