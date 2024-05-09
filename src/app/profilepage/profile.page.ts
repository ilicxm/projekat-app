import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profilepage.services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  constructor(private router: Router, private profileService: ProfileService) {}

  profile: any = {
    name: '',
    address: '',
    city: '',
    email: '',
    postal_code: null,
    phone_number: null
  };
  profileSaved: boolean = false;
  editMode: boolean = false;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.profile.picture = URL.createObjectURL(file);
  }

  toggleEditMode() {
    if (this.editMode && this.profileSaved) {
      this.editMode = false;
    } else {
      this.editMode = !this.editMode;
    }
  }

  saveProfile() {
    // Provera da li korisnik sa email adresom već postoji
    this.profileService.checkUserByEmail(this.profile.email)
      .subscribe((response: any) => {
        if (response.exists) {
          // Ako korisnik već postoji, ažuriramo njegov profil
          this.updateProfile();
        } else {
          // Ako korisnik ne postoji, kreiramo novi profil
          this.createProfile();
        }
      }, (error: any) => {
        console.error('Error checking user by email', error);
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


  createProfile() {
    this.profileService.saveProfile(this.profile)
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



