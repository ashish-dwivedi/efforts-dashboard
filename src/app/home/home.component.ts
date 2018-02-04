import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { UserComponent } from '../user/user.component';
import { UserDataService } from '../user/user.data.service';
import { AddEffortComponent } from '../add-effort/add.effort.component';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  userData: any = {};

  constructor(private _Router: Router, private _NgbModal: NgbModal,
    private _UserDataService: UserDataService) {
    if(!localStorage.getItem('userid')) {
      this.openUserSetModal();
    } else {
      this.userData = this._UserDataService.getUserData()['selected'];
    }
  }

  openUserSetModal() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false
    };
    this._NgbModal.open(UserComponent, ngbModalOptions);
  }

  selectUserMode() {
    this._Router.navigate(['./report']);
  }

  effortsValidation() {
    this._Router.navigate(['./validation']);
  }

  addReport() {
   const modalInstance =  this._NgbModal.open(AddEffortComponent);
   modalInstance.componentInstance.modalData = {data: {}, mode : 'add'};
  }
}
