import { Component, OnInit, Input } from '@angular/core';
import { CustomerAppointment } from 'src/app/shared/models/customerAppointment.model';

@Component({
  selector: 'fcw-appointment-reschedule',
  templateUrl: './appointment-reschedule.component.html',
  styleUrls: ['./appointment-reschedule.component.scss']
})
export class AppointmentRescheduleComponent implements OnInit {

  @Input() appointment: CustomerAppointment;

  constructor() { }

  ngOnInit() {
  }

}
