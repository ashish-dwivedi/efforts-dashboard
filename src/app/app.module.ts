import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SharedService } from './shared/shared.service';
import { UserDataService } from './user/user.data.service';
import { ReportComponent } from './report/report.component';
import { NotifyComponent } from './notify/notify.component';
import { TrendComponent } from './analyze/analyze.component';
import { AddEffortService } from './add-effort/add.effort.service';
import { AddEffortComponent } from './add-effort/add.effort.component';
import { ValidationComponent } from './validation/validation.component';
import { ModifyUserComponent } from './modify-user/modify.user.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserComponent,
    TrendComponent,
    NotifyComponent,
    ReportComponent,
    AddEffortComponent,
    ValidationComponent,
    ModifyUserComponent
  ],
  imports: [
    HttpModule,
    FormsModule,
    ChartsModule,
    BrowserModule,
    RouterModule.forRoot([
      { path : 'home', component: HomeComponent },
      { path : 'analyze', component: TrendComponent },
      { path : 'report', component: ReportComponent },
      { path : 'user', component: ModifyUserComponent },
      { path : '', redirectTo: 'home', pathMatch: 'full' },
      { path : 'validation', component: ValidationComponent }
    ]),
    NgbModule.forRoot()
  ],
  providers: [SharedService, UserDataService, AddEffortService],
  entryComponents: [UserComponent, AddEffortComponent, NotifyComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
