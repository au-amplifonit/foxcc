import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keys'
})
export class KeysPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if ( Object.keys(value) ) {
      return Object;
    } else {
      return null;//.map(key => value[key]);
    }

  }

}
