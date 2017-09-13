import { Component, OnInit } from '@angular/core';
import {Http, RequestOptions} from "@angular/http";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {Headers} from '@angular/http';

@Component({
  selector: 'app-new-challenge',
  templateUrl: './new-challenge.component.html',
  styleUrls: ['./new-challenge.component.css']
})
export class NewChallengeComponent implements OnInit {

  user = null;
  constructor(private _http: Http, private router: Router, private authService: AuthService) { }

  ngOnInit() {


    this._http.get('http://http://176.9.157.103:4000/api/popularchallenges').subscribe((data) => {





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

  popularChallenges = [];
  newChallenge = {

    title: "",
    description : "",
    requirements : "",
    reward : "",
    amount : "",
    deadline : "",
    file: null

}

  moreInfo = "";



  fileChange(evt){

    var files = evt.target.files;
    var file = files[0];

    this.newChallenge.file = file;


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


    this._http.put('http://http://176.9.157.103:4000/api/notifications/', formData, options).subscribe((data) => {

      if (data.json().status == "success") {

        console.log("success");

        this.user.openNotifications = false;


      } else {

      }


    });





  }

  makeRequest() {




    if (this.newChallenge.title == ""  || this.newChallenge.deadline == ""  || this.newChallenge.description == ""  || this.newChallenge.requirements ==  "" || this.newChallenge.reward == "" || this.newChallenge.file == null)
    {
      this.moreInfo = "Please fill all fields!";
    }
    else
    {


          this.moreInfo = "";
          var formData = new FormData();
          let headers = new Headers();



      formData.append('title', this.newChallenge.title);
      formData.append('description', this.newChallenge.description);
      formData.append('requirements', this.newChallenge.requirements);
      formData.append('reward', this.newChallenge.reward);
      formData.append('amount', this.newChallenge.amount);
      formData.append('deadline', this.newChallenge.deadline);

          formData.append('pict', this.newChallenge.file, this.newChallenge.file.name);




          //headers.append('Content-Type', 'multipart/form-data');





          this._http.post('http://http://176.9.157.103:4000/api/new-challenge', formData,).subscribe((data) => {

            if (data.json().status == "Challenge Created") {

              this.router.navigate(['/challenges']);

            } else
            {
              this.moreInfo = "Something went wrong!";
            }


          });








    }




  }

}
