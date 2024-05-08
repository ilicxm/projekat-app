import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profilepage.services'; // Prilagodite putanju ako je potrebno

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage {
  constructor(private router: Router, private profileService: ProfileService) {}

  // Profile data
  profile: any = {
    name: '',
    address: '',
    city: '',
    email: '',
    postal_code: null,
    phone_number: null
  }; // Objekat za čuvanje podataka profila
  profileSaved: boolean = false; // Zastava za praćenje da li je profil sačuvan
  editMode: boolean = false; // Zastava za praćenje da li je u režimu izmene

  // Funkcija za upravljanje odabirom datoteke za profilnu sliku
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.profile.picture = URL.createObjectURL(file);
  }

  // Funkcija za prebacivanje u režim izmene
  toggleEditMode() {
    if (this.editMode && this.profileSaved) {
      this.editMode = false;
    } else {
      this.editMode = !this.editMode;
    }
  }

  // Funkcija za čuvanje profila
  saveProfile() {
    // Postavljamo ID korisnika pre čuvanja profila


    this.profileService.saveProfile(this.profile)
      .subscribe(
        (response: any)=> {
          console.log('Profil uspešno sačuvan', response);
          this.profileSaved = true;
          this.editMode = false;
        },
        (error: any) => {
          console.error('Greška prilikom čuvanja profila', error);
        }
      );
  }

  // Funkcija za odjavu
  logout() {
    this.router.navigate(['/login']);
  }

  // Privatna metoda za dobijanje ID korisnika
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
