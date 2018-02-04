import * as _ from 'lodash';
import {Headers} from '@angular/http';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { UserComponent } from './user/user.component';
import { UserDataService } from './user/user.data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title: string = 'Efforts Overview';
  public static apiBaseUrl: string = 'http://localhost:3200/';
  public static headers = new Headers();
  headers = AppComponent.headers.append('Content-Type', 'application/json');

  constructor(private _Router: Router,
    private _UserDataService: UserDataService,
    private _NgbModal: NgbModal
  ) {}

  ngOnInit() {
    if(!localStorage.getItem('userid')) {
      this._Router.navigate(['/home']);
    } else {
      this._UserDataService.getUsersRawData().subscribe(
        (data) => {
          this._UserDataService.setUserData(
            {
              users: data,
              selected: _.find(data, {userid : localStorage.getItem('userid')})
            }
          );
        }
      );
    }
  }

  openUserSetModal() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false
    };
    this._NgbModal.open(UserComponent, ngbModalOptions);
  }
}
