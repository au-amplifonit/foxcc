import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'fcw-confirm-button',
  template: `
      <button class="btn btn-primary ">{{text}}</button>
  `,
  styleUrls: ['./confirm-button.component.scss']
})
export class ConfirmButtonComponent implements OnInit {
  @Input() text = 'Confirm';

  constructor() { }

  ngOnInit() {
  }

}
