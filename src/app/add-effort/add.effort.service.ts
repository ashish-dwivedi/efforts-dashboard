import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { AppComponent } from '../app.component';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class AddEffortService {

  months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

  constructor(private _Http: Http, private _SharedService: SharedService) {}

  getEffortRawData(field) {
    return this._Http.get('http://localhost:3200/' + field)
    .map(response => response.json())
    .do (
      data => console.log('Efforts fetched!'),
      error => console.log(error));
  }

  getEfforts(params) {
    params = this._SharedService.getParamString(params);
    return this._Http.get(AppComponent.apiBaseUrl + 'efforts' + params)
    .map(response => response.json())
    .do(
      data => console.log('Efforts fetched'),
      error => console.log('Something went wrong fetching efforts!')
    );
  }

  saveNewEffort(params): Observable<Response> {
    return this._Http.post(AppComponent.apiBaseUrl + 'efforts/add', params,
      {headers: AppComponent.headers})
    .map(data => data.json())
    .do(
      data => console.log('Effort logged!'),
      error => console.log('Effort logging failed!')
    );
  }

  updateEffort(params): Observable<Response> {
    return this._Http.put(AppComponent.apiBaseUrl + 'efforts/modify/' + params.id, params, {headers: AppComponent.headers})
    .map(response => response.json())
    .do(
      data => console.log('Effort updated'),
      error => console.log('Effort updation failed!')
    );
  }

  getFormattedDate(date) {
    const weekStart = new Date(date.setDate(date.getDate() - date.getDay() + 1)),
      weekEnd = new Date(date.setDate(date.getDate() - date.getDay() + 5));

    return (weekStart.getMonth() === weekEnd.getMonth() ?
      this.months[weekStart.getMonth()] + ' ' +
      weekStart.getDate() + '-' + weekEnd.getDate() + ', ' + weekStart.getFullYear() :
      this.months[weekStart.getMonth()] + ' ' +
      weekStart.getDate() + '-' +
      this.months[weekEnd.getMonth()] + ' ' +
      weekEnd.getDate() + ', ' + weekEnd.getFullYear()
    );
  }

  generateWeeksOfYear(date?) {
    let yearWeekArr: any[] = [],
      weekObject: any = {},
      firstDay = date ? date : (new Date());

    firstDay.setMonth(0);
    firstDay.setDate(1);
    for(let i = 0; i < 52; i++) {
      weekObject['date'] = new Date(firstDay);
      weekObject['weekNumber'] = i + 1;
      weekObject['formattedDate'] = this.getFormattedDate(firstDay);
      yearWeekArr.push(weekObject);
      weekObject = {};
      firstDay.setDate(firstDay.getDate() + 7);
    }
    return yearWeekArr;
  }

  removeSavedEffort(params): Observable<Response> {
    let url = AppComponent.apiBaseUrl + 'efforts/delete/' + params.id;

    return this._Http.delete(url, {headers: AppComponent.headers})
    .map(
      response => response.json()
    )
    .do(
      data => console.log('Effort Removed'),
      error => console.log('Effort removal failed!')
    )
  }
}
