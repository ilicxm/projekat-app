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
      this.createOrUpdateProfile();
    }
  }

  getUserProfile() {
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
      console.error('User email not found');
      return;
    }

    this.profileService.checkUserByEmail(userEmail)
      .subscribe((response: any) => {
        console.log('User profile:', response);
        if (response.exists) {
          // Postoji profil, možeš ga dohvatiti ako je potrebno
          // Implementiraj logiku za dohvatanje profila ako je potrebno
        } else {
          console.log('User profile does not exist');
          // Profil ne postoji, možeš izvršiti odgovarajuće akcije
        }
      }, (error: any) => {
        console.error('Error checking user profile', error);
      });
  }
  createOrUpdateProfile() {
    const userEmail = this.profile.email;

    if (!userEmail) {
      console.error('User email not provided');
      return;
    }

    this.profileService.checkUserByEmail(userEmail)
      .subscribe((response: any) => {
        if (response.exists) {
          console.log('User profile already exists');
          this.updateProfile();
        } else {
          console.log('Creating new user profile');
          this.createProfile();
        }
      }, (error: any) => {
        console.error('Error checking user profile', error);
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
    const userEmail = this.profile.email;

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
    // Brisanje email adrese iz localStorage prilikom odjave
    localStorage.removeItem('userEmail');

    // Resetovanje profila na prazne vrednosti
    this.profile = {
      name: '',
      address: '',
      city: '',
      postal_code: '',
      email: '',
      phone_number: ''
    };

    // Preusmeravanje na login stranicu
    this.router.navigate(['/login']);
  }
}





