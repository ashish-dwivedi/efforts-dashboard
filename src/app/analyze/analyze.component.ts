import * as _ from 'lodash';
import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../user/user.data.service';
import { AddEffortService } from '../add-effort/add.effort.service';

@Component({
  templateUrl: './analyze.component.html',
  styleUrls: ['./analyze.component.scss']
})
export class TrendComponent implements OnInit {

  currentChartLabels:string[] = [];
  availableTypes = [{type: 'line', icon: 'trending_up'},
    {type: 'bar', icon: 'assessment'},
    {type: 'radar', icon: 'wifi_tethering'},
    {type: 'pie', icon: 'pie_chart'},
    {type: 'polarArea', icon: 'blur_circular'},
    {type: 'doughnut', icon: 'donut_small'}
  ];
  currentChartData:any[] = [{label: 'Tasks', data: []}];
  currentChartType:string = 'bar';
  loggedInUser: any = {};
  allEfforts: any[] = []
  displayCharts = false;

  constructor(private _UserDataService: UserDataService,
  private _AddEffortService: AddEffortService) {}

  formatChartsData() {
    let allTasks = _.uniq(_.map(this.allEfforts, 'task')),
      taskEffortMap = {},
      i, j, key;

    for(i = 0; i < allTasks.length; i++) {
      taskEffortMap[allTasks[i]] = 0;
      for(j = 0; j < this.allEfforts.length; j++) {
        if(allTasks[i] === this.allEfforts[j].task) {
          taskEffortMap[allTasks[i]] += this.allEfforts[j].effort;
        }
      }
    }
    for(key in taskEffortMap) {
      this.currentChartLabels.push(key);
      this.currentChartData[0].data.push(taskEffortMap[key]);
    }
    this.displayCharts = true;
  }

  ngOnInit() {
    this.loggedInUser = this._UserDataService.getUserData();
    const params = {
      userid: this._UserDataService.getUserData()['selected'].userid,
      year: moment(new Date()).year()
    };
    this._AddEffortService.getEfforts(params)
    .subscribe(
      (response) => {
        this.allEfforts = response;
        this.formatChartsData();
      }
    );
  }
}