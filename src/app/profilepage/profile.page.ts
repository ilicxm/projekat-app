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
    phone_number: '',
    picture: ''
  };
  profileSaved: boolean = false;
  editMode: boolean = false;

  ngOnInit() {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      this.profile.email = userEmail;
      console.log('User email found:', userEmail); // Debug poruka
      this.checkProfileFields(userEmail);
    } else {
      console.error('User email not found in localStorage'); // Debug poruka
    }
  }

  checkProfileFields(email: string) {
    this.profileService.checkProfileFields(email)
      .subscribe((response: any) => {
        if (response.exists) {
          // Provjeravamo da li su sva polja popunjena
          if (response.allFieldsFilled) {
            // Sva polja profila su popunjena, dobavljamo detalje profila
            this.getProfileDetails();
            // Onemogući editovanje profila ako su sva polja popunjena
            this.editMode = false;
          } else {
            // Neka od polja profila nisu popunjena, omogućavamo editovanje profila
            this.editMode = true;
          }
        } else {
          // Profil ne postoji, omogućavamo editovanje profila
          this.editMode = true;
        }
      }, (error: any) => {
        console.error('Error checking profile fields', error);
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
    // Provjeri da li već postoji profil s ovim emailom
    this.profileService.checkUserByEmail(this.profile.email)
      .subscribe((response: any) => {
        if (response.exists) {
          // Profil već postoji, ne treba kreirati novi
          console.log('Profile already exists');
          this.editMode = false; // Onemogući editovanje profila jer već postoji
        } else {
          // Profil ne postoji, kreiraj novi
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
        if (response.profile && response.profile.picture) {
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
    // Clear profile data
    this.profile = {
      address: '',
      city: '',
      postal_code: '',
      phone_number: '',
    };

    localStorage.removeItem('userEmail');
    console.log('User email removed from localStorage');

    // Call logout endpoint
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
}
