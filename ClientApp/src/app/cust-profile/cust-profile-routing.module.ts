import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustProfileComponent} from './cust-profile.component';


const routes: Routes = [
  {
    path: '', component: CustProfileComponent, children: [
      {path: 'cust-over', loadChildren: () => import('../cust-profile/cust-over/cust-over.module').then(m => m.CustOverModule)},
      {path: 'acc-det', loadChildren: () => import('../cust-profile/acc-det/acc-det.module').then(m => m.AccDetModule)},
      {path: 'acc-det/:id', loadChildren: () => import('../cust-profile/acc-det/acc-det.module').then(m => m.AccDetModule)},
			{path: 'acc-det?xid:xid', loadChildren: () => import('../cust-profile/acc-det/acc-det.module').then(m => m.AccDetModule)},
      {path: 'appointments', loadChildren: () => import('./appointments/appointments.module').then(m => m.AppointmentsModule)},
      {path: 'prod', loadChildren: () => import('../cust-profile/prod/prod.module').then(m => m.ProdModule)},
      {path: 'clinical', loadChildren: () => import('../cust-profile/clinical/clinical.module').then(m => m.ClinicalModule)},
      {path: 'doc', loadChildren: () => import('../cust-profile/doc/doc.module').then(m => m.DocModule)},
      {path: 'notes', loadChildren: () => import('../cust-profile/notes/notes.module').then(m => m.NotesModule)},
      {path: 'cust-app', loadChildren: () => import('../cust-profile/cust-app/cust-app.module').then(m => m.CustAppModule)  }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustProfileRoutingModule {
}
