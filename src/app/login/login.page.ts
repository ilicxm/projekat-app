import { Component } from '@angular/core';
import { UserService } from '../services/user.services';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  login() {
    this.userService.login(this.email, this.password)
      .pipe(
        catchError(error => {
          console.error('Error logging in:', error);
          return throwError('Error logging in');
        })
      )
      .subscribe((response: any) => {
        console.log('Response from server:', response);
        if (response && response.message === 'Login successful') {
          console.log('Uspesno!');

          localStorage.setItem('userEmail', this.email);
          console.log('User email set in localStorage:', this.email);
          this.router.navigate(['/tabs']);
        } else {
          console.log('Login failed. Invalid email or password.');
        }
      });
  }
}


