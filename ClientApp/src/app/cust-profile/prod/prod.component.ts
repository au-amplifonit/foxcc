import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fcw-prod',
  template: `
    <p>
      prod works!
    </p>
  `,
  styleUrls: ['./prod.component.scss']
})
export class ProdComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
