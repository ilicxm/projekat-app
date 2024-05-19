import { Component } from '@angular/core';
import { UserService } from '../services/user.services';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router) {}

  signUp() {
    this.userService.register(this.name, this.email, this.password)
      .subscribe((response: any) => {
        console.log('Response from server:', response);
        if (response && response.message === 'User registered successfully') {

          this.router.navigate(['/login']);
        }
      });
  }
}
