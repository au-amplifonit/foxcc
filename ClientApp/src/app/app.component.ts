import {Component} from '@angular/core';

@Component({
  selector: 'fcw-root',
  template: `
      <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'foxCCWeb';
}
