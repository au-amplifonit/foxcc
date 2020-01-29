import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClinicalScheduleComponent } from './clinical-schedule.component';
import { NewAppointmentComponent } from './new-appointment/new-appointment.component';

const routes: Routes = [
  { path: '', component: ClinicalScheduleComponent },
  { path: 'new-appointment', component: NewAppointmentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClinicalScheduleRoutingModule {}
