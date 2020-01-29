import { Component, OnInit, Input } from '@angular/core';
import { CustomerAppointment } from 'src/app/shared/models/customerAppointment.model';
import { ButtonMenuItemsList } from 'src/app/shared/models/utility/button-menu-items-list';

@Component({
  selector: 'fcw-cust-app-list',
  templateUrl: 'cust-app-list.component.html',
  styleUrls: ['./cust-app-list.component.scss']
})
export class CustAppListComponent implements OnInit {
  @Input() customerAppointments: CustomerAppointment[];
  public customerActions: ButtonMenuItemsList[] = [
    {
      icon: '../../../../assets/img/svg/checkmark-circle-outline_2.svg',
      text: 'Confirm',
      eventName: 'confirm-event',
      url: ''
    },
    {
      icon: '../../../../assets/img/svg/close-red.svg',
      text: 'Cancel',
      eventName: 'cancel-event',
      url: ''
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
