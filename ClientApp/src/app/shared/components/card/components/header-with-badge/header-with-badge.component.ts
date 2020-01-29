import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'fcw-header-with-badge',
  template: `
      <div class="d-flex flex-row align-content-center">
          <div class="p-1 m-1 black">
              <h2>{{title}}</h2></div>
          <fcw-badge-generic *ngIf="card === 'contact' && contactPreferredIsOtherOne === false && !isNewForm" [type]="'warning'" [text]="'Primary'" class="p-2 m-auto"></fcw-badge-generic>
          <fcw-badge-generic *ngIf="card === 'otherContact' && contactPreferredIsOtherOne === true && !isNewForm" [type]="'warning'" [text]="'Primary'" class="p-2 m-auto"></fcw-badge-generic>
          <fcw-badge-generic *ngIf="badgeText" class="m-auto" [type]="badgeType" [text]="badgeText"></fcw-badge-generic>
      </div>
  `,
  styleUrls: ['./header-with-badge.component.scss']
})
export class HeaderWithBadgeComponent implements OnInit {
  @Input() title: string;
  @Input() card: string;
  @Input() isNewForm: boolean;
  @Input() contactPreferredIsOtherOne: boolean;
  @Input() badgeType: string;
  @Input() badgeText: string;

  constructor() { }

  ngOnInit() {
  }

}
