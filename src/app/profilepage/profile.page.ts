

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profilepage.services';
import { OrderService } from '../services/order.services';
import { Product, Customer } from '../checkout/checkout.page';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile: any = {
    name: '',
    address: '',
    city: '',
    postal_code: '',
    email: '',
    phone_number: '',
    picture: ''
  };
  profileSaved: boolean = false;
  editMode: boolean = false;
  orders: any[] = [];

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private orderService: OrderService
  ) {}

  ngOnInit() {

    const userEmail = localStorage.getItem('userEmail');

    console.log('Email prijavljenog kroisnika',userEmail);
    if (userEmail) {
      this.profile.email = userEmail;
      this.checkProfileFields(userEmail);

      this.loadOrders(userEmail);
    } else {
      console.error('User email not found in localStorage');
    }
  }


  checkProfileFields(email: string) {
    this.profileService.checkProfileFields(email)
      .subscribe((response: any) => {
        if (response.exists) {
          if (response.allFieldsFilled) {
            this.getProfileDetails();


            this.editMode = false;
          } else {
            this.editMode = true;
          }
        } else {
          this.editMode = true;
        }
      }, (error: any) => {
        console.error('Error checking profile fields', error);
      });
  }


  loadOrders(email: string) {
    this.orderService.getOrders(email)
      .subscribe((response: any) => {
        this.orders = response;
      }, (error: any) => {
        console.error('Error loading orders', error);
      });
  }


  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.profile.picture = URL.createObjectURL(file);
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  saveProfile() {
    if (this.profileSaved) {
      this.updateProfile();
    } else {
      this.createProfile();
    }
  }

  createProfile() {

    this.profileService.checkUserByEmail(this.profile.email)
      .subscribe((response: any) => {
        if (response.exists) {

          console.log('Profile already exists');
          this.editMode = false;
        } else {

          this.profileService.updateProfile(this.profile)
            .subscribe((response: any) => {
              console.log('Profile updated successfully', response);
              this.profileSaved = true;
              this.editMode = false;
            }, (error: any) => {
              console.error('Error updating profile', error);
            });
        }
      }, (error: any) => {
        console.error('Error checking if profile exists', error);
      });
  }

  updateProfile() {
    this.profileService.updateProfile(this.profile)
      .subscribe((response: any) => {
        console.log('Profile successfully updated', response);
        this.profileSaved = true;
        this.editMode = false;
      }, (error: any) => {
        console.error('Error updating profile', error);
      });
  }

  getProfileDetails() {
    this.profileService.getProfileDetails(this.profile.email)
      .subscribe((response: any) => {
        console.log('Profile details retrieved successfully', response);
        if (response.profile) {
          this.profile = response.profile;
          this.profileSaved = true;
        } else {
          console.error('Profile picture not found in response');
        }
      }, (error: any) => {
        console.error('Error getting profile details', error);
      });
  }

  logout() {

    this.profile = {
      address: '',
      city: '',
      postal_code: '',
      phone_number: '',
    };

    localStorage.removeItem('userEmail');
    console.log('User email removed from localStorage');


    this.profileService.logout().subscribe(
      (response: any) => {
        console.log('Logout successful', response);
        this.router.navigate(['/login']);
      },
      (error: any) => {
        console.error('Error logging out', error);
      }
    );
  }

  checkout() {

    const customer: Customer = {
      name: this.profile.name,
      surname: '',
      address: this.profile.address,
      phone: this.profile.phone_number,
      email: this.profile.email
    };

    const cartItems: Product[] = [];

    const paymentMethod = '';

    const deliveryDate = '';

    this.orderService.placeOrder(cartItems, customer, paymentMethod, deliveryDate)
      .subscribe((response: any) => {
        console.log('Order placed successfully', response);

      }, (error: any) => {
        console.error('Error placing order', error);

      });
  }

}


