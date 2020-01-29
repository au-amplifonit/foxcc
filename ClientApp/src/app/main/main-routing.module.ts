import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './main.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'custSearch',
        loadChildren: () => import('../cust-search/cust-search.module').then(m => m.CustSearchModule)
      }, {
        path: 'custProfile',
        loadChildren: () => import('../cust-profile/cust-profile.module').then(m => m.CustProfileModule)
      },
      {
        path: 'clinical-schedule',
        loadChildren: () => import('../clinical-schedule/clinical-schedule.module').then(m => m.ClinicalScheduleModule)
      }
    ]
  },
  {path: '', redirectTo: 'main/custSearch'},
  {path: '**', redirectTo: ''}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MainRoutingModule {
}
