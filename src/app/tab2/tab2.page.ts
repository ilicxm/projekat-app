import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  showNotificationPopup = false;

  constructor() {}

  showNotification() {
    this.showNotificationPopup = true;
    setTimeout(() => {
      this.showNotificationPopup = false;
    }, 3000); // Prikazuje se 3 sekunde, nakon toga nestaje
  }

}

