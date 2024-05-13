import { Component } from '@angular/core';
import { UserService } from '../services/user.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router) {}

  login() {
    this.userService.login(this.email, this.password)
      .subscribe((response: any) => {
        console.log('Response from server:', response);
        if (response && response.message === 'Login successful') {
          // Ako je prijava uspešna, preusmeri korisnika na glavnu stranicu
          this.router.navigate(['/tabs']);
        } else {
          // Ako nije, možeš prikazati odgovarajuću poruku korisniku ili uraditi nešto drugo
          console.log('Login failed. Invalid email or password.');
        }
      });
  }
}
