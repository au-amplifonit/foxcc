import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustAppComponent } from './cust-app.component';
import { CustAppRoutingModule } from './cust-app-routing.module';
import { CustAppListComponent } from './cust-app-list/cust-app-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustAppModalComponent } from './cust-app-modal/cust-app-modal.component';



@NgModule({
  declarations: [CustAppComponent, CustAppListComponent],
  imports: [
    CommonModule,
    CustAppRoutingModule,
    SharedModule
  ],
  exports: [CustAppListComponent],
})
export class CustAppModule { }
