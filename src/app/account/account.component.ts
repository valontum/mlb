import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Http, RequestOptions} from '@angular/http';
import {AuthService} from "../services/auth.service";
import {Headers} from '@angular/http';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {




  private sub: any;
  profile = null;
  user = null;
  popularChallenges = [];

  constructor(private route: ActivatedRoute, private router: Router, private _http:Http, private authService: AuthService) {




  }



  setOffNotifications()
  {






    var formData = new FormData();

    let headers = new Headers();
    let options = new RequestOptions({headers: headers});


    this._http.put('http://176.9.157.103/api/notifications/', formData, options).subscribe((data) => {

      if (data.json().status == "success") {

        console.log("success");

        this.user.openNotifications = false;


      } else {

      }


    });





  }




  postLike(postId, id)
  {





    if(this.authService.isAuthenticated().status) {

      var formData = new FormData();
      formData.append('target_publisher_id', this.profile.challenges[id].publisher_id);
      let headers = new Headers();
      let options = new RequestOptions({headers: headers});


      this._http.put('http://176.9.157.103/api/like/' + postId, formData, options).subscribe((data) => {

        if (data.json().status == "success") {

          console.log("success");

          this.profile.challenges[id].likes.push({publisher_id: this.user.id});


        } else {

        }


      });


    }else
    {
      this.router.navigateByUrl('/login');
    }


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




  unLike(postId, id)
  {



    if(this.authService.isAuthenticated().status) {

      var formData = new FormData();
      formData.append('like_id', this.user.id);
      let headers = new Headers();
      let options = new RequestOptions({headers: headers});


      this._http.put('http://176.9.157.103/api/unlike/' + postId, formData, options).subscribe((data) => {

        if (data.json().status == "success") {

          console.log("success");


        } else {

          var removeIndex = this.profile.challenges[id].likes.map(function (item) {
            return item.publisher_id;
          }).indexOf(this.user.id);

// remove object
          this.profile.challenges[id].likes.splice(removeIndex, 1);


        }


      });

    }
    else
    {
      this.router.navigateByUrl('/login');
    }


  }

  signout()
  {
    this.authService.signOut();
      this.router.navigate(['/home']);
  }





  ngOnInit() {

    this._http.get('http://176.9.157.103/api/popularchallenges').subscribe((data) => {





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


    this.sub = this.route.params.subscribe(params => {

      if(params['id']!="" || params['id']!= null)
      {
        this._http.get('http://176.9.157.103/api/profile/'+params['id']).subscribe((data) => {


          this.profile = data.json();
          console.log(this.profile);

          if(this.profile.bio == null)
          {
            this.router.navigate(['/challenges']);
          }



        });

      }else
      {
        this.router.navigate(['/challenges']);
      }





      // (+) converts string 'id' to a number

      // In a real app: dispatch action to load the details here.
    });


  }

}
