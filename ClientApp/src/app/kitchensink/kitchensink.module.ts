import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {KitchensinkRoutingModule} from './kitchensink-routing.module';
import {KitchensinkComponent} from './kitchensink/kitchensink.component';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CoreModule} from '../core/core.module';


@NgModule({
  declarations: [KitchensinkComponent],
  imports: [
    CommonModule,
    KitchensinkRoutingModule,
    CoreModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class KitchensinkModule { }
