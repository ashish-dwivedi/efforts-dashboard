import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AddEffortComponent } from '../add-effort/add.effort.component';
import { AddEffortService } from '../add-effort/add.effort.service';
import { UserDataService } from '../user/user.data.service';

@Component({
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  allEfforts: any[] = [];
  yearData: any = {
    selectedYear: 'All',
    yearList: ['All', moment(new Date()).year(), moment(new Date()).year() - 1, moment(new Date()).year() - 2]
  }

  constructor(
    private _NgbModal: NgbModal,
    private _UserDataService: UserDataService,
    private _AddEffortService: AddEffortService
  ) {}

  ngOnInit() {
    this.getEffortsData();
  }

  getEffortsData(selectedYear ?: number) {
    const params = {
      userid: this._UserDataService.getUserData()['selected'].userid
    };
    if(selectedYear && (typeof selectedYear === 'number')) {
      params['year'] = selectedYear;
    }
    this._AddEffortService.getEfforts(params)
    .subscribe(
      (response) => {
        this.allEfforts = response;
      }
    );
  }

  downloadAsExcel() {
    const jsonObject = JSON.stringify(this.allEfforts);
    let data, downloadLink, blob, url;

    data = this.convertToCSV(jsonObject);
    downloadLink = document.createElement('a');
    blob = new Blob(['\ufeff', data]);
    url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = this._UserDataService.getUserData()['selected'].username + '-Efforts.csv';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  editEffort(effort) {
    const modalRef = this._NgbModal.open(AddEffortComponent);

    modalRef.componentInstance.inputData = effort;
    modalRef.componentInstance.mode = 'edit';
    modalRef.result.then(result => this.getEffortsData());
  }

  convertToCSV(objArray) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = 'WEEK, APPLICATIONS, TASKS, EFFORTS, INCIDENTS' + '\r\n',
      line, i;

    for (i = 0; i < array.length; i++) {
      line = '';
      line = '"' + array[i]['date'] + '"' + ',' +
        '"' + (Array.isArray(array[i]['apps']) ? array[i]['apps'].toSring() : array[i]['apps']) +
        '"' + ',' + array[i]['task'] + ',' + array[i]['effort'] + ',' + (array[i]['numofincidents'] || 'NA');
      str += line + '\r\n';
    }
    return str;
  }
}
