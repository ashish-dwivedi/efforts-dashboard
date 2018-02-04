import * as _ from 'lodash';
import * as moment from 'moment';
import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';

import { UserDataService } from '../user/user.data.service';
import { AddEffortService } from '../add-effort/add.effort.service';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
// import { ViewChildren } from '@angular/core/src/metadata/di';

@Component({
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss']
})
export class ValidationComponent implements OnInit, AfterViewInit {

  userList: string[];
  allEfforts:any[] = [];
  weeksOfYear: any[] = [];
  lastScrollPos: number = 0;
  yearData: any = {
    selectedYear: moment(new Date).year(),
    yearList: [moment(new Date).year(), moment(new Date).year() - 1, moment(new Date).year() - 2]
  };
  @ViewChild('headRef', {read: ElementRef}) headRef: ElementRef;
  @ViewChildren('bodyRef', {read: ElementRef}) bodyRef: QueryList<ElementRef>;

  constructor(private _UserDataService: UserDataService,
    private _AddEffortService: AddEffortService) {}

  getUsersRawData() {
    this._UserDataService.getUsersRawData()
    .subscribe(
      (response) => {this.userList = response;
        this.getEffortsData();
      },
      (error) => console.log('Something went wrong while fetching users list!')
    )
  }

  getEffortsData() {
    const params = {
      year: this.yearData.selectedYear
    };
    let i, j;
    this._AddEffortService.getEfforts(params)
    .subscribe(
      (response) => {
        this.allEfforts = response;
        for(i = 0; i < this.userList.length; i++) {
          this.userList[i]['efforts'] = [];
          for(j = 0; j < this.allEfforts.length; j++) {
            if(this.userList[i]['userid'] === this.allEfforts[j]['userid']) {
              this.userList[i]['efforts'].push(this.allEfforts[j]);
            }
          }
          this.getWeeksEffort(this.userList[i]);
        }
      }
    );
  }

  getWeeksEffort(userData) {
    let i;
    userData['weekData'] = [];
    for(i = 0; i < 52; i++) {
      userData['weekData'][i] = _.findIndex(userData.efforts, {weeknumber: (i + 1)}) !== -1 ?
      _.find(userData.efforts, {weeknumber: (i + 1)}).effort : '-';
    }
  }

  appendScrollListener() {
    this.headRef.nativeElement.addEventListener('scroll', (event) => {
      this.lastScrollPos = this.headRef.nativeElement.scrollLeft;
      let localArr = this.bodyRef.toArray();
      for(let i=0; i<localArr.length; i++) {
        localArr[i].nativeElement.scrollLeft = this.lastScrollPos;
      }
    });
  }

  ngOnInit() {
    this.getUsersRawData();
    this.weeksOfYear = this._AddEffortService.generateWeeksOfYear();
  }

  ngAfterViewInit() {
    this.appendScrollListener();
  }
}