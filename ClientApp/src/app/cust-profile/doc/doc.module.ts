import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DocRoutingModule} from './doc-routing.module';
import {DocComponent} from './doc.component';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [DocComponent],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    DocRoutingModule
  ],
  entryComponents: [DocComponent]
})
export class DocModule { }
