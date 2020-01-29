import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClinicalRoutingModule } from './clinical-routing.module';
import { ClinicalComponent } from './clinical.component';


@NgModule({
  declarations: [ClinicalComponent],
  imports: [
    CommonModule,
    ClinicalRoutingModule
  ],
  entryComponents: [ClinicalComponent]
})
export class ClinicalModule { }
