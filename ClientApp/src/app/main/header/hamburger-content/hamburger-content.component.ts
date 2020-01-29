import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'fcw-hamburger-content',
  templateUrl: './hamburger-content.component.html',
  styleUrls: ['./hamburger-content.component.scss']
})
export class HamburgerContentComponent implements OnInit {
  @Output() linkClicked: EventEmitter<any> = new EventEmitter();
  constructor() {}
  ngOnInit() {}

  switchHamStatus($event: MouseEvent) {
    this.linkClicked.emit('linkClicked');
  }

}
