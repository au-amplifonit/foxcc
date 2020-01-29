import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import {BsDropdownModule} from 'ngx-bootstrap/dropdown';

import {ConfigurationService} from './core/services/api/configuration/configuration-api.service';
import {CoreModule} from './core/core.module';
// import { UiSwitchModule } from 'ngx-ui-switch';
// import { NgxUiLoaderModule } from 'ngx-ui-loader';
import {SharedModule} from './shared/shared.module';
// import { ToastrModule } from 'ngx-toastr';
// import {RouterModule} from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeAu from '@angular/common/locales/en-AU';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { WinAuthInterceptor } from './shared/services/Auth/win-auth.interceptor';
import { DynamicHeaderDirective } from './dynamic-header.directive';
registerLocaleData(localeAu);


const appInitializerFn = (appConfig: ConfigurationService) => {
  return () => {
    return appConfig.loadConfig();
  };
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    BrowserAnimationsModule,
    // RouterModule,
    // ToastrModule.forRoot({toastComponent: CustomToast})
    // UiSwitchModule,
    // NgxUiLoaderModule,
    // BsDropdownModule.forRoot()
  ],
  providers: [
    ConfigurationService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [ConfigurationService]
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: WinAuthInterceptor,
      multi: true
		}
	],
  bootstrap: [AppComponent]
})
export class AppModule { }
