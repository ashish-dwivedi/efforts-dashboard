import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserDataService } from '../user/user.data.service';

@Component({
  templateUrl : './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  userList: string[];
  // selectedUser: string = localStorage.getItem('userid') || '';
  selectedUser: any = {};

  constructor(
    public _NgbActiveModal: NgbActiveModal,
    private _UserDataService: UserDataService
  ) {}

  setUser() {
    localStorage.setItem('userid', this.selectedUser.userid);
    this._UserDataService.setUserData(
      {
        users: this.userList,
        selected: this.selectedUser
      }
    );
    window.location.reload();
    this._NgbActiveModal.close('user set');
  }

  getUserRawData() {
    this._UserDataService.getUsersRawData()
    .subscribe(
      (response) => {
        this.userList = response;
        this.selectedUser = _.find(this.userList, {userid : localStorage.getItem('userid')});
      },
      (error) => console.log('Something went wrong while fetching users list!')
    )
  }

  ngOnInit() {
    this.getUserRawData();
  }

}