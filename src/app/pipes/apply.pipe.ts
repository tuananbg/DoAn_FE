import {NgModule, Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'apply',
})
export class ApplyPipe implements PipeTransform {
  transform(value: Object | ((...args: any[]) => any), arg1: any, ...args: any[]): any {
    return typeof value === 'function' ? value(arg1, ...args) : (value as {
      [key: string]: any
    })[arg1].apply(value, args);
  }
}

@NgModule({
  imports: [],
  providers: [],
  exports: [ApplyPipe],
  declarations: [ApplyPipe],
})
export class ApplyPipeModule {
}
