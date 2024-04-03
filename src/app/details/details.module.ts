import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from '../tab1/tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { DetailsPageRoutingModule } from './details-routing.module';
import { DetailsPage } from './details.page'; // Ispravljena putanja

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    DetailsPageRoutingModule, // Dodajemo ruting modul ako postoji
  ],
  declarations: [DetailsPage]
})
export class DetailsModule {} // Ispravljen naziv modula

