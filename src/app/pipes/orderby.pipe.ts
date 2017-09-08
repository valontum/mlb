import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'orderByPipe'
})
export class OrderByPipe implements PipeTransform{

  transform(array: Array<any>, args: string): Array<any> {

    if(!array || array === undefined || array.length === 0) return null;

    array.sort((a: any, b: any) => {
      if (new Date(a.publish_date) < new Date(b.publish_date)) {
        return -1;
      } else if (new Date(a.publish_date) > new Date(b.publish_date)) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }

}
