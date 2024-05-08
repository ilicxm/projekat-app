import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profilepage.services'; // Adjust the path if needed

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage {

  profile: any = {
    name: '',
    address: '',
    city: '',
    email: '',
    postal_code: null,
    phone_number: null
  };
  constructor(private router: Router, private profileService: ProfileService) {}

  // Profile data
 // profile: any = {}; // Object to store profile data
  profileSaved: boolean = false; // Flag to track if profile is saved
  editMode: boolean = false; // Flag to track if in edit mode

  // Function to handle file selection for profile picture
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.profile.picture = URL.createObjectURL(file);
  }

  // Function to toggle edit mode
  toggleEditMode() {
    if (this.editMode && this.profileSaved) {
      this.editMode = false;
    } else {
      this.editMode = !this.editMode;
    }
  }

  // Function to save profile
  saveProfile() {
    // Set user ID before saving the profile
    this.profile.userid = this.getUserIdSomehow();

    this.profileService.saveProfile(this.profile)
      .subscribe(
        (response: any)=> {
          console.log('Profile saved successfully', response);
          this.profileSaved = true;
          this.editMode = false;
        },
        (error: any) => {
          console.error('Error saving profile', error);
        }
      );
  }

  // Function to handle logout
  logout() {
    this.router.navigate(['/login']);
  }

  // Private method to get user ID
  private getUserIdSomehow(): number | null {
    // Implementacija funkcije za dobijanje ID korisnika
    // Na primer, ako koristite lokalno skladište za prijavu
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      return user.id;
    } else {
      return null;
    }
  }
}
