import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppointmentsComponent} from './appointments.component';
import { CustAppComponent } from '../cust-app/cust-app.component';


const routes: Routes = [
  {path: '', component: CustAppComponent},
  {path: 'newAppointment', component: AppointmentsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule {
}
