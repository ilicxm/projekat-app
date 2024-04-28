import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class ConfirmPage implements OnInit {
  confirmationMessage: string='';
  constructor() { }

  ngOnInit() {
    this.confirmationMessage = 'Please confirm your action.';
  }

}
