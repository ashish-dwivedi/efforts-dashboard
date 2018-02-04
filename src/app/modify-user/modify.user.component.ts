import { Component, OnInit } from "@angular/core";
import { UserDataService } from "../user/user.data.service";
import { NotifyComponent } from "../notify/notify.component";

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './modify.user.html',
  styleUrls: ['./modify.user.scss']
})
export class ModifyUserComponent implements OnInit {
  userRoleList: string[] = ['User', 'Admin'];
  userDomainList: string[] = ['EMEA', 'AP', 'AM'];
  createData: any = {
    userid: '',
    username: '',
    role: '',
    domain: ''
  };
  expanded:any = {add: false, viewDelete: true};
  userList;

  constructor(private _UserDataService: UserDataService,
    private _NgbModal: NgbModal
  ) {}

  getUserRawData() {
    this._UserDataService.getUsersRawData().subscribe(
      response => this.userList = response,
      error => {
        const modalInstance = this._NgbModal.open(NotifyComponent);
        modalInstance.componentInstance.modalData = {
          status: 'failure',
          message: 'Something went wrong while fetching user data!'
        }
      }
    )
  }

  addNewUser() {
    let params = {
      userid: this.createData.userid,
      role: this.createData.role,
      username: this.createData.username,
      domain: this.createData.domain
    };
    this._UserDataService.addNewUser(params).subscribe(
      (response) => {
        const modalInstance = this._NgbModal.open(NotifyComponent);
        modalInstance.componentInstance.modalData = {
          status: 'success',
          message: 'User successfully added to database!'
        }
        this.createData = {
          userid: '',
          username: '',
          role: '',
          domain: ''
        };
        this.getUserRawData();
      },
      (error) => {
        const modalInstance = this._NgbModal.open(NotifyComponent);
        modalInstance.componentInstance.modalData = {
          status: 'failure',
          message: 'Something went wrong while saving user!'
        }
      }
    )
  }

  deleteUser(user) {
    this._UserDataService.deleteUser(user.userid).subscribe(
      data => {
        const modalInstance = this._NgbModal.open(NotifyComponent);
        modalInstance.componentInstance.modalData = {
          status: 'success',
          message: 'User removed successfully'
        };
        this.getUserRawData();
      },
      error => {
        const modalInstance = this._NgbModal.open(NotifyComponent);
        modalInstance.componentInstance.modalData = {
          status: 'failure',
          message: 'Something went wrong while removing user!'
        };
      }
    )
  }

  expandCollapse(element) {
    for(let key in this.expanded) {
      if(key === element) {
        this.expanded[key] = !this.expanded[key];
      } else {
        this.expanded[key] = false;
      }
    }
  }

  ngOnInit() {
    this.getUserRawData();
  }
}