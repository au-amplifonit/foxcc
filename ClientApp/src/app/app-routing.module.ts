import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [
  {
    path: 'main', loadChildren: () => import('./main/main.module').then(m => m.MainModule)
  },
  {path: 'sink', loadChildren: () => import('./kitchensink/kitchensink.module').then(m => m.KitchensinkModule)},
  {path: '', redirectTo: 'main/custSearch', pathMatch: 'full'},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
