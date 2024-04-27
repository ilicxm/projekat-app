// app.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router) {
    setTimeout(() => {
      this.router.navigate(['/tabs']); //
    }, 3000); // Promenite vreme (u milisekundama) prema potrebi
  }
}

