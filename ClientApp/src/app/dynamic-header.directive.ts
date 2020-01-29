import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[DynamicHeader]'
})
export class DynamicHeaderDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
