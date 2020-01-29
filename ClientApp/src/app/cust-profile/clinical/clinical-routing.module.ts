import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ClinicalComponent} from './clinical.component';


const routes: Routes = [
  {path: '', component: ClinicalComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicalRoutingModule {
}
