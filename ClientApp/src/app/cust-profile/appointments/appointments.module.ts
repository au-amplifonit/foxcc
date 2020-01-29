import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentsComponent } from './appointments.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustAppModule } from '../cust-app/cust-app.module';
import { CustSearchComponent } from 'src/app/cust-search/cust-search.component';
import { AppointmentRescheduleComponent } from './appointment-reschedule/appointment-reschedule.component';
// import { AppointmentModalComponent } from './appointment-modal/appointment-modal.component';


@NgModule({
  declarations: [AppointmentsComponent, AppointmentRescheduleComponent],
  imports: [
    CommonModule,
    CustAppModule,
    AppointmentsRoutingModule,
    SharedModule
  ],
  entryComponents: [AppointmentsComponent, CustSearchComponent]
})
export class AppointmentsModule { }
