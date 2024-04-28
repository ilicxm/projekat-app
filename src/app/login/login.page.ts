import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  Message: string='';

  constructor(
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.Message = 'Please confirm your action.';
  }

  login() {
    // Redirecting to tabs/tab1
    this.navCtrl.navigateRoot('/tabs', { animationDirection: 'forward' });
  }
}
