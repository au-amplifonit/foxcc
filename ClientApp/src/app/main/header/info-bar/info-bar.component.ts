import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fcw-info-bar',
  template: `
    <div class="container-fluid" style="border: 1px solid black; width: 100%">
        <div class="row">
            <div class="col-2"><h6>name surname</h6></div>
            <div class="col-10"><h6>altro</h6></div>
        </div>
    </div>
  `,
  styleUrls: ['./info-bar.component.scss']
})
export class InfoBarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
