import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DocModule} from './doc.module';
import {DocComponent} from './doc.component';


const routes: Routes = [
  {path: '', component: DocComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocRoutingModule {
}
