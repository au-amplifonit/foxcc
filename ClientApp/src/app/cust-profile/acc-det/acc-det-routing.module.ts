import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AccDetComponent} from './acc-det.component';


const routes: Routes = [
  {path: '', component: AccDetComponent},
	{path: 'customer/:id', redirectTo: '' },
  {path: 'customer?xid=:xid', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccDetRoutingModule { }
