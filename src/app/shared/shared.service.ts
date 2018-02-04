import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {

  getParamString( params ) {
    let paramStr = '?';
    for( let attr in  params ) {
      paramStr += attr + '=' + params[attr] + '&';
    }
    return paramStr;
  }
}