import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'fcw-left-menu',
  template: `
    <div class="sideMenu left-menu-open col-2 p-0" [ngClass]="{'left-menu-hide':!show}"
    >
    <fcw-hamburger-content (linkClicked)="switchHamMenu($event)"></fcw-hamburger-content>
    </div>
  `,
  styleUrls: ['./left-menu.component.scss']
})
export class LeftMenuComponent implements OnInit {
  @Output() linkClicked: EventEmitter<any> = new EventEmitter();
  @Input() show: boolean;

  constructor() { }

  ngOnInit() {
  }

  switchHamMenu($event) {
    this.linkClicked.emit('linkClicked');
  }

}
