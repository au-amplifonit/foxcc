import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { Component } from '@angular/core';
import { Toast, ToastrService, ToastPackage } from 'ngx-toastr';

@Component({
  selector: '[custom-toast-component]',
  styles: [`
    :host {
      background-color: #000!important;
      position: relative;
      overflow: hidden;
      margin: 0 0 6px;
      padding: 10px 20px 10px 0px;
      width: 370px;
      border-radius: 4px 4px 4px 4px;
      color: ;
      pointer-events: all;
      cursor: pointer;
      font-size: 12px
    }
    .btn-pink {
      -webkit-backface-visibility: hidden;
      -webkit-transform: translateZ(0);
    }
  `],
  template: `
  <div class="row-toastr" [style.display]="state.value === 'inactive' ? 'none' : ''">
    <div class="col-1">
      <svg-icon  src="/assets/img/svg/checkmark-circle-outline_2.svg" [stretch]="true"
        class="success-icon-color icon  align-top" [applyCss]="true"  [svgStyle]="{'width.px':20, 'height.px':20, 'float':'left'}">
      </svg-icon>
      </div>
      <div class="col-7">
      <div *ngIf="title" class="success-title align-middle" [attr.aria-label]="title">
        {{ title }}
      </div>
      <div *ngIf="message && options.enableHtml" role="alert" aria-live="polite"
        [class]="options.messageClass" [innerHTML]="message">
      </div>
      <div *ngIf="message && !options.enableHtml" role="alert" aria-live="polite"
        [class]="options.messageClass" [attr.aria-label]="message">
        {{ message }}
      </div>
    </div>
    <div class="col-3">
    <button type="button" class="btn toastr-button" *ngIf="!options.closeButton"  (click)="remove()">
    {{ undoString }}
    </button>
      <a *ngIf="options.closeButton" (click)="remove()" class="btn btn-pink btn-sm">
        close
      </a>
    </div>
  </div>
  <div *ngIf="options.progressBar">
    <div class="toast-progress" [style.width]="width + '%'"></div>
  </div>
  `,
  animations: [
    trigger('flyInOut', [
      state('inactive', style({
        opacity: 0,
      })),
      transition('inactive => active', animate('400ms ease-out', keyframes([
        style({
          transform: 'translate3d(100%, 0, 0) skewX(-30deg)',
          opacity: 0,
        }),
        style({
          transform: 'skewX(20deg)',
          opacity: 1,
        }),
        style({
          transform: 'skewX(-5deg)',
          opacity: 1,
        }),
        style({
          transform: 'none',
          opacity: 1,
        }),
      ]))),
      transition('active => removed', animate('400ms ease-out', keyframes([
        style({
          opacity: 1,
        }),
        style({
          transform: 'translate3d(100%, 0, 0) skewX(30deg)',
          opacity: 0,
        }),
      ]))),
    ]),
  ],
  preserveWhitespaces: false,
})
export class CustomToast extends Toast {
  // used for demo purposes
  undoString = 'Close';

  // constructor is only necessary when not using AoT
  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
  ) {
    super(toastrService, toastPackage);
  }

  action(event: Event) {
    event.stopPropagation();
    this.undoString = 'undid';
    this.toastPackage.triggerAction();
    return false;
  }
}
