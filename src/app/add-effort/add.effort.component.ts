import * as moment from 'moment';
import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AddEffortService } from './add.effort.service';
import { UserDataService } from '../user/user.data.service';
import { NotifyComponent } from '../notify/notify.component';


@Component({
  templateUrl: './add.effort.component.html',
  styleUrls: ['./add.effort.component.scss']
})
export class AddEffortComponent implements OnInit {
  @Input() inputData: any;
  @Input() mode: any;
  modalData: any = {};
  allRows: any = [];
  notifyActive = false;
  today: Date = new Date();
  modalError = '';

  constructor(private _NgbActiveModal: NgbActiveModal,
    private _NgbModal: NgbModal,
    private _AddEffortService: AddEffortService,
    private _UserDataService: UserDataService) {
  }

  ngOnInit() {
    this.modalData.rawData = {};
    this._AddEffortService.getEffortRawData('tasks')
    .subscribe(
      (response: Response) => { this.modalData.rawData['allTasks'] = response}
    );
    this._AddEffortService.getEffortRawData('apps')
    .subscribe(
      (response: Response) => { this.modalData.rawData['allApps'] = response}
    );
    if(this.mode && this.mode === 'edit') {
      this.modalData.mode = this.mode;
      this.modalData.selected = Object.assign({}, this.inputData);
    } else {
      this.initializeModalVariables();
    }
  }

  private initializeModalVariables() {
    this.modalData.selected = {
        task: '',
        apps: [],
        date: this._AddEffortService.getFormattedDate(this.today),
        updatedOn: new Date(),
        userid: this._UserDataService.getUserData()['selected'].userid,
        weekNumber: moment(this.today).week()
      }
  }

  selectApps( app ) {
    this.modalError = '';
    if(this.modalData.selected.apps.indexOf( app ) === -1) {
      this.modalData.selected.apps.push( app );
      this.modalData.selected.apps.sort();
    } else {
      this.modalData.selected.apps.splice( this.modalData.selected.apps.indexOf( app ), 1 );
    }
  }

  changeWeek( direction ) {
    this.modalError = '';
    if( direction === 'forw' ) {
      if(this.shouldDisableNext()) {
        return;
      }
      this.today = moment(this.today).add(7, 'day').toDate();
    } else {
      this.today = moment(this.today).subtract(7, 'day').toDate();
    }
    this.modalData.selected.date = this._AddEffortService.getFormattedDate(this.today);
    this.modalData.selected.weekNumber = moment(this.today).week();
  }

  addNewEffortRow() {
    this.modalError = '';
    if(!this.modalData.selected.apps.length || !this.modalData.selected.task ||
      !this.modalData.selected.effort) {
        this.modalError = 'Fill in all the fields before adding new row!';
        return;
      }
    this.allRows.push(this.modalData.selected);
    this.initializeModalVariables();
  }

  saveEditEffort() {
    this.modalError = '';
    this._AddEffortService.updateEffort( this.modalData.selected )
    .subscribe(
      (response : Response) => {this._NgbActiveModal.close('done')
        const modalInstance =  this._NgbModal.open(NotifyComponent);
        modalInstance.componentInstance.modalData = {status: 'success', message : 'Effort updated successfully.'};
      }
    );
  }

  persistAllRows() {
    let i;

    if(this.allRows.length > 0) {
      for(i = 0; i < this.allRows.length; i++) {
        this.persistEffortRow(this.allRows[i]);
      }
    } else {
      this.persistEffortRow(this.modalData.selected);
    }
  }

  persistEffortRow(rowData) {
    let params = {};

    this.modalError = '';
    if(rowData.date === '' || !rowData.apps.length
      || rowData.task === '' || rowData.effort == '') {
      this.modalError = 'All fields are mandatory for submission!';
      return;
    }
    params['id'] = null;
    params['userid'] = this._UserDataService.getUserData()['selected'].userid;
    params['apps'] = rowData.apps.toString();
    params['task'] = rowData.task;
    params['date'] = rowData.date;
    params['updatedon'] = rowData.updatedOn;
    params['effort'] = rowData.effort;
    params['numofincidents'] = rowData.numofincidents || 0;
    params['weeknumber'] = rowData.weekNumber;
    this._AddEffortService.saveNewEffort(params)
    .subscribe(
      (response : Response) => {
        this._NgbActiveModal.close('done');
        if(!this.notifyActive) {
          const modalInstance =  this._NgbModal.open(NotifyComponent);
          modalInstance.componentInstance.modalData = {status: 'success', message : 'Effort logged successfully.'};
          this.notifyActive = true;
        }
      },
      error => {
        if(!this.notifyActive) {
          const modalInstance =  this._NgbModal.open(NotifyComponent);
          modalInstance.componentInstance.modalData = {status: 'failure', message : 'Could not log effort! Please try again'};
          this.notifyActive = true;
        }
      }
    )
  }

  removeUnpersistedRow(index) {
    this.allRows.splice(index, 1);
  }

  removeSavedEffort() {
    this._AddEffortService.removeSavedEffort(this.modalData.selected).subscribe(
      response => {
        this._NgbActiveModal.close('deleted');
        const modalInstance =  this._NgbModal.open(NotifyComponent);
        modalInstance.componentInstance.modalData = {status: 'success', message : 'Effort deleted!'};
      }
    )
  }

  shouldDisableNext() {
    return ((moment(this.today).week() === moment(new Date()).week()) ? true : false);
  }
}