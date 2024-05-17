import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cake-details',
  templateUrl: './cake-details.component.html',
  styleUrls: ['./cake-details.component.scss']
})
export class CakeDetailsComponent {
  @Input() cakeName: string = '';
  @Input() details: string = '';

  constructor() { }
}



