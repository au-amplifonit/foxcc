import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CustOverComponent} from './cust-over.component';


const routes: Routes = [
  {path: '', component: CustOverComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustOverRoutingModule { }
