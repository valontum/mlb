import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {TimeAgoPipe} from 'time-ago-pipe';
import {Http, RequestOptions} from '@angular/http';
import {Headers} from '@angular/http';

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.css']
})
export class ChallengesComponent implements OnInit {

  challenges = [];
  user = null;
  popularChallenges = [];

  constructor(private authService: AuthService, private router: Router, private _http:Http) {






  }

  ngOnInit() {

    if(this.authService.isAuthenticated().status)
    {
      this.user = this.authService.getUser();
      this.authService.getNotifications().subscribe((data) => {





        this.user.notifications = data.json()[0].notifications;
        this.user.openNotifications = data.json()[0].openNotifications;


      });
    }
    this._http.get('http://localhost:3000/api/challenges').subscribe((data) => {





      this.challenges = data.json();
       console.log(this.challenges);
      console.log(this.user);



    });

    this._http.get('http://localhost:3000/api/popularchallenges').subscribe((data) => {





      this.popularChallenges = data.json();




    });
  }


  signout()
  {
    this.authService.signOut();
    this.router.navigate(['/login']);
  }

  likeUnlike(array)
  {


    if(this.user == null)
    {


      return "Like";

    }
    else
    {
      for(var i=0; i<array.length;i++) {
        if (array[i].publisher_id == this.user.id)
        {
          return "Unlike";
        }

      }

      return "Like";
    }





  }


  postLike(postId, id)
  {




    if(this.authService.isAuthenticated().status) {

      var formData = new FormData();
      formData.append('target_publisher_id', this.challenges[id].publisher_id);
      let headers = new Headers();
      let options = new RequestOptions({headers: headers});


      this._http.put('http://localhost:3000/api/like/' + postId, formData, options).subscribe((data) => {

        if (data.json().status == "success") {

          console.log("success");

          this.challenges[id].likes.push({publisher_id: this.user.id});


        } else {

        }


      });


    }else
    {
      this.router.navigateByUrl('/login');
    }


  }




  setOffNotifications()
  {






      var formData = new FormData();

      let headers = new Headers();
      let options = new RequestOptions({headers: headers});


      this._http.put('http://localhost:3000/api/notifications/', formData, options).subscribe((data) => {

        if (data.json().status == "success") {

          console.log("success");

          this.user.openNotifications = false;


        } else {

        }


      });





  }


  unLike(postId, id)
  {



    if(this.authService.isAuthenticated().status) {

      var formData = new FormData();
      formData.append('like_id', this.user.id);
      let headers = new Headers();
      let options = new RequestOptions({headers: headers});


      this._http.put('http://localhost:3000/api/unlike/' + postId, formData, options).subscribe((data) => {

        if (data.json().status == "success") {

          console.log("success");


        } else {

          var removeIndex = this.challenges[id].likes.map(function (item) {
            return item.publisher_id;
          }).indexOf(this.user.id);

// remove object
          this.challenges[id].likes.splice(removeIndex, 1);


        }


      });

    }
    else
    {
      this.router.navigateByUrl('/login');
    }


  }


}
