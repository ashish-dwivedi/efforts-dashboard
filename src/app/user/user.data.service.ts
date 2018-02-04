import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppComponent } from '../app.component';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Injectable()
export class UserDataService {
  userData: any = {
    selected: {},
    users: []
  };

  constructor(private _Http: Http) {
    if(localStorage.getItem('userid')) {
      this.userData['selected'].userid = localStorage.getItem('userid');
    }
  }

  setUserData(userData) {
    this.userData = userData;
  }

  getUserData() {
    return this.userData;
  }

  getUsersRawData() {
    return this._Http.get('http://localhost:3200/users')
    .map(response => response.json())
    .do(
      data => console.log('Users fetched'),
      error => console.log('Something went wrong fetching users!')
    );
  }

  addNewUser(params) {
    return this._Http.post('http://localhost:3200/users/add', params)
    .map(response => response.json())
    .do(
      data => console.log('User added'),
      error => console.log('Something went wrong adding user!')
    )
  }

  deleteUser(userid) {
    return this._Http.delete('http://localhost:3200/users/delete/' + userid)
    .map(response => response.json())
    .do(
      data => console.log('User removed'),
      error => console.log('Something went wrong removing user!')
    )
  }
}