import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustOverRoutingModule } from './cust-over-routing.module';
import { CustOverComponent } from './cust-over.component';


@NgModule({
  declarations: [CustOverComponent],
  imports: [
    CommonModule,
    CustOverRoutingModule
  ],
  entryComponents: [CustOverComponent]
})
export class CustOverModule { }
