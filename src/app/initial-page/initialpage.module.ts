import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { InitialPageComponent } from './initial-page.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [InitialPageComponent],
  imports: [
    CommonModule,
    IonicModule, // Dodajte IonicModule ovde
    RouterModule.forChild([
      {
        path: '',
        component: InitialPageComponent
      }
    ])
  ]
})
export class InitialPageModule { }
