// signup.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SignupPage } from './signup.page';
import { SignupPageRoutingModule } from './signup-routing.module'; // Import routing module
import { UserService } from '../services/user.services';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupPageRoutingModule // Include the routing module here
  ],
  declarations: [SignupPage],
  providers: [UserService],
})
export class SignupPageModule {}
