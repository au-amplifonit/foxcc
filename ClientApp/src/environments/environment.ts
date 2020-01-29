// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  SRV: 'http://sau02ap02foxsit.d09.root.sys',
  // SRV: '',
  // Base URL: /Fox.Microservices.Customers
  customerServiceUrl: `/Fox.Microservices.Customers/api/v1/`,
  appointmentServiceUrl: `/Fox.Microservices.Diary/api/v1/`,
  commonServiceUrl: `/Fox.Microservices.Common/api/v1/Common/`,
  pageNumber: '0',
  pageSize: '20',
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error'; // Included with Angular CLI.
