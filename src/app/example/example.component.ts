import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
})
export class ExampleComponent  implements OnInit {

  constructor() { }

  ngOnInit() {
    // Example of using localStorage
    localStorage.setItem('key', 'value'); // Set item
    const item = localStorage.getItem('key'); // Get item
    console.log(item); // Output: value
  }

}
