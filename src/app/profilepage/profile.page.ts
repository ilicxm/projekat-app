import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profilepage.services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  constructor(private router: Router, private profileService: ProfileService) {}

  profile: any = {
    name: '',
    address: '',
    city: '',
    postal_code: '',
    email: '',
    phone_number: ''
  };
  profileSaved: boolean = false;
  editMode: boolean = false;

  ngOnInit() {
    this.getUserProfile();
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

  getUserProfile() {
    // Pretpostavka da se korisnikov email nalazi u lokalnoj memoriji nakon prijave
    const userEmail = localStorage.getItem('userEmail');

    if (userEmail) {
      this.profileService.getUserProfile(userEmail)
        .subscribe((response: any) => {
          console.log('User profile:', response);
          this.profile = response.profile;
          this.profileSaved = true;
        }, (error: any) => {
          console.error('Error getting user profile', error);
        });
    }
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

  createProfile() {
    // Convert phone_number to string
    this.profile.phone_number = this.profile.phone_number.toString();

    this.profileService.createProfile(this.profile)
      .subscribe((response: any) => {
        console.log('Profile successfully created', response);
        this.profileSaved = true;
        this.editMode = false;
      }, (error: any) => {
        console.error('Error creating profile', error);
      });
  }

  logout() {
    this.router.navigate(['/login']);
  }
}



