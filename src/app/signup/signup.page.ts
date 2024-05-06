import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient) {}

  signUp() {
    const userData = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.http.post(environment.apiUrl, userData)
      .subscribe((response) => {
        console.log('Response from server:', response);
        // Ovdje možete dodati logiku za obradu odgovora, kao što je prikazivanje poruke korisniku
      });
  }

}
