import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustAppComponent } from './cust-app.component';


const routes: Routes = [
  {path: '', component: CustAppComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustAppRoutingModule { }
