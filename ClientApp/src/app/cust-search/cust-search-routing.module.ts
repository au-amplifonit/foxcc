import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CustSearchComponent} from './cust-search.component';

const routes: Routes = [
  {path: '', component: CustSearchComponent}
  // {path: '', component: ClientListItemComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustSearchRoutingModule { }
