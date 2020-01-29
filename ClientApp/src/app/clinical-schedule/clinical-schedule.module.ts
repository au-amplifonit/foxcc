import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClinicalScheduleRoutingModule } from './clinical-schedule-routing.module';
import { ClinicalScheduleComponent } from './clinical-schedule.component';
import { SharedModule } from '../shared/shared.module';
import { CustAppModule } from '../cust-profile/cust-app/cust-app.module';
import { NewAppointmentComponent } from './new-appointment/new-appointment.component';
import { CustSearchComponent } from '../cust-search/cust-search.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';


@NgModule({
  declarations: [ClinicalScheduleComponent, NewAppointmentComponent],
  imports: [
    CommonModule,
    ClinicalScheduleRoutingModule,
    CustAppModule,
    SharedModule
  ],
  entryComponents: [CustSearchComponent]
})
export class ClinicalScheduleModule { }
