import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fcw-main',
  styleUrls: ['./main.component.scss'],
  template: `
    <fcw-header></fcw-header>
    <div>
      <router-outlet></router-outlet>
    </div>
  `
})
export class MainComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
