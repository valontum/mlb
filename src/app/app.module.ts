import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {RouterModule} from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';
import {NewChallengeComponent} from './new-challenge/new-challenge.component';

import {HomeComponent} from './home/home.component';

import {ChallengesComponent} from './challenges/challenges.component';
import {ChallengeComponent} from './challenge/challenge.component';
import {AccountComponent} from './account/account.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {SolutionsComponent} from './solutions/solutions.component';
import { HttpModule } from '@angular/http';
import {ImageUploadModule} from 'angular2-image-upload';
import {FormsModule} from '@angular/forms';
import {AuthService} from './services/auth.service';
import {TimeAgoPipe} from "time-ago-pipe";
import {OrderByPipe} from "./pipes/orderby.pipe";


@NgModule({
  declarations: [

    AppComponent,
    LoginComponent,
    NewChallengeComponent,

    HomeComponent,

    ChallengesComponent,
    ChallengeComponent,
    AccountComponent,
    NotificationsComponent,
    SolutionsComponent,
    TimeAgoPipe,
    OrderByPipe
  ],
  imports: [
    FormsModule,
    HttpModule,
    ImageUploadModule.forRoot(),
    BrowserModule,
    RouterModule.forRoot([
      { path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      { path: 'home',
        component: HomeComponent,
        data: { title: 'Project' },
      },

      { path: 'login',
        component: LoginComponent,
        data: { title: 'Project' },
      },
      { path: 'challenges',
        component: ChallengesComponent,
        data: { title: 'Project'},
      },


      { path: 'new-challenge',
        component: NewChallengeComponent,
        data: { title: 'Project'},
      },

      { path: 'notifications',
        component: NotificationsComponent,
        data: { title: 'Project'},
      },
      { path: 'profile/:id',
        component: AccountComponent,
        data: { title: 'Project'},
      },
      { path: 'challenge/:id',
        component: ChallengeComponent,
        data: { title: 'Project'},
      },

    ])
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
