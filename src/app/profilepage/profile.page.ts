import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  profile: any = {}; // Object to store profile data
  profileSaved: boolean = false; // Flag to track if profile is saved
  editMode: boolean = false; // Flag to track if in edit mode

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    // Here you can perform necessary actions with the selected image, such as display or preparation for sending
    // For now, let's just set it to profile object
    this.profile.picture = URL.createObjectURL(file);
  }

  toggleEditMode() {
    if (this.editMode && this.profileSaved) {
      // If in edit mode and profile is saved, disable edit mode
      this.editMode = false;
    } else {
      // Otherwise, toggle edit mode
      this.editMode = !this.editMode;
    }
  }

  saveProfile() {
    // Implementation of function to save profile, for example saving to local storage
    localStorage.setItem('profile', JSON.stringify(this.profile));
    // Set profileSaved flag to true
    this.profileSaved = true;
    // Disable edit mode
    this.editMode = false;
  }

}
