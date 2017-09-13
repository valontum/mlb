import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TimeAgoPipe} from 'time-ago-pipe';
import {Http, RequestOptions} from '@angular/http';
import {Headers} from '@angular/http';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private _http:Http, private authService: AuthService) { }



  notificationType = [ "",
    "",
    "liked your challenge",
    "liked your idea",
    "liked your question",
    "posted a question on your challenge",
    "submitted an idea on your challenge"



  ];


  user = null;
  sub : any;

  popularChallenges = [];


  ngOnInit() {

    this._http.get('http://176.9.157.103:4000/api/popularchallenges').subscribe((data) => {





      this.popularChallenges = data.json();




    });


    if(this.authService.isAuthenticated().status)
    {
      this.user = this.authService.getUser();
      this.authService.getNotifications().subscribe((data) => {





        this.user.notifications = data.json()[0].notifications;
        this.user.openNotifications = data.json()[0].openNotifications;


      });
    }



  }


  signout()
  {
    this.authService.signOut();
    this.router.navigate(['/login']);
  }




  setOffNotifications()
  {






    var formData = new FormData();

    let headers = new Headers();
    let options = new RequestOptions({headers: headers});


    this._http.put('http://176.9.157.103:4000/api/notifications/', formData, options).subscribe((data) => {

      if (data.json().status == "success") {

        console.log("success");

        this.user.openNotifications = false;


      } else {

      }


    });





  }

}
