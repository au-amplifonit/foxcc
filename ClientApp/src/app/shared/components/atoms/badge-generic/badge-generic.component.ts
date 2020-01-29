import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'fcw-badge-generic',
  template: `
      <span
              class="p-1 m-1 rounded text-nowrap"
              [ngClass]="{
                            'badge badge-pill badge-success' : type === 'success',
                            'badge badge-pill badge-primary' : type === 'primary',
                            'badge badge-pill badge-secondary' : type === 'secondary',
                            'badge badge-pill badge-warning text-white' : type === 'warning',
                            'badge badge-pill badge-info' : type === 'info',
                            'badge badge-pill badge-dark' : type === 'dark',
                            'badge badge-pill text-info bg-white border border-info p-2 m-1': type === 'info-custom'
                            }"
      >
          {{text}}
      </span>
  `,
  styleUrls: ['./badge-generic.component.scss']
})
export class BadgeGenericComponent implements OnInit {
  @Input() text: string;
  @Input() type: string; // success, warning , primary, secondary, info, dark

  constructor() {
  }

  ngOnInit() {
  }

}
