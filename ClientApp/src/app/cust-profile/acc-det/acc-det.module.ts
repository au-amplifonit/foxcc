import {NgModule, LOCALE_ID} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccDetRoutingModule} from './acc-det-routing.module';
import {AccDetComponent} from './acc-det.component';
import {SharedModule} from '../../shared/shared.module';
// import {ReactiveFormsModule} from '@angular/forms';
// import { ButtonsModule, BsDatepickerModule } from 'ngx-bootstrap';
// import { UiSwitchModule } from 'ngx-ui-switch';
// import { AlertModule } from 'ngx-bootstrap/alert';

import { CustomToast } from 'src/app/shared/components/atoms/custom-toast/custom-toast.component';
import { CustProfileModule } from '../cust-profile.module';
import { registerLocaleData } from '@angular/common';
import localeAu from '@angular/common/locales/en-AU';

registerLocaleData(localeAu);


@NgModule({
  declarations: [AccDetComponent],
  imports: [
    CommonModule,
    // ToastContainerModule,
    // ToastNoAnimationModule,
    AccDetRoutingModule,
    SharedModule,
    // ReactiveFormsModule,
    // ButtonsModule,
    // UiSwitchModule,
    // AlertModule.forRoot(),
    // BsDatepickerModule.forRoot(),
    CustProfileModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-AU' },
  ],
  entryComponents: [AccDetComponent, CustomToast]
})
export class AccDetModule { }
