import { Component } from '@angular/core';
import { UserService } from '../services/user.services';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profilepage.services';
import {catchError, throwError} from "rxjs";
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router, private profileService: ProfileService) {}

  login() {
    this.userService.login(this.email, this.password)
      .subscribe((response: any) => {
        console.log('Response from server:', response);
        if (response && response.message === 'Login successful') {
          // Ako je prijava uspešna, preusmeri korisnika na glavnu stranicu
          this.router.navigate(['/tabs']);
          this.checkProfile();
        } else {
          // Ako nije, možeš prikazati odgovarajuću poruku korisniku ili uraditi nešto drugo
          console.log('Login failed. Invalid email or password.');
        }
      });
  }
  checkProfile() {
    this.profileService.checkUserByEmail(this.email)
      .pipe(
        catchError(error => {
          console.error('Error checking user profile:', error);
          return throwError('Error checking user profile');
        })
      )
      .subscribe((response: any) => {
        if (response.exists) {
          console.log('User profile exists');
        } else {
          console.log('User profile does not exist, creating...');

        }
      }, (error: any) => {
        console.error('Error checking user profile', error);
      });
  }
}
