import { Component, OnInit } from '@angular/core';
import {Http, RequestOptions} from '@angular/http';
import {ActivatedRoute, Router} from "@angular/router";
import {Headers} from '@angular/http';
import {AuthService} from "../services/auth.service";




@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.css']
})
export class ChallengeComponent implements OnInit {

  private sub: any;

  challenge = null;
  showMore = false;
  showMoreQuestion = false;
  showQuestions = false;

  data =
    {
      solution : "",
      question : ""
    }

    user = null;


  popularChallenges = [];

  constructor(private route: ActivatedRoute, private router: Router, private _http:Http, private authService: AuthService) {



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

    this._http.get('http://176.9.157.103:4000/api/popularchallenges').subscribe((data) => {





      this.popularChallenges = data.json();




    });



    this.sub = this.route.params.subscribe(params => {

      if(params['id']!="" || params['id']!= null)
      {
        this._http.get('http://176.9.157.103:4000/api/challenge/'+params['id']).subscribe((data) => {



          this.challenge  = data.json()[0];














          if(this.challenge == null)
          {
            this.router.navigate(['/challenges']);
          }



        });

      }else
      {
        this.router.navigate(['/challenges']);
      }





    });
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

  goTo(location: string): void {
    window.location.hash = location;
  }

  postSolution()
  {



    if(this.authService.isAuthenticated().status) {
      var formData = new FormData();
      let headers = new Headers();
      let options = new RequestOptions({headers: headers});


      if (this.data.solution != "") {

        formData.append('solution', this.data.solution);
        formData.append('target_publisher_id', this.challenge.publisher_id);


        //headers.append('Content-Type', 'multipart/form-data');


        this._http.put('http://176.9.157.103:4000/api/ideas/' + this.challenge.id, formData, options).subscribe((data) => {

          if (data.json().status == "success") {



            console.log("success");
            this.challenge.ideas.unshift({
              publisher_name: this.authService.getUser().name,
              publisher_id: this.authService.getUser().id,
              description: this.data.solution,
              publish_date: new Date(),
              likes: []
            });

            this.data.solution = "";

          } else {

          }


        });

      }
    }else
    {
      this.router.navigate(['/login',{routeData:'/challenge/'+this.challenge.id}]);
    }

  }


  postQuestion()
  {



    if(this.authService.isAuthenticated().status) {
      var formData = new FormData();
      let headers = new Headers();
      let options = new RequestOptions({headers: headers});


      if (this.data.question != "") {

        formData.append('question', this.data.question);
        formData.append('target_publisher_id', this.challenge.publisher_id);

        //headers.append('Content-Type', 'multipart/form-data');


        this._http.put('http://176.9.157.103:4000/api/question/' + this.challenge.id, formData, options).subscribe((data) => {

          if (data.json().status == "success") {



            console.log("success");
            this.challenge.questions.unshift({
              publisher_name: this.authService.getUser().name,
              publisher_id: this.authService.getUser().id,
              description: this.data.question,
              publish_date: new Date(),
              likes: []
            });

            this.data.question = "";

          } else {

          }


        });

      }
    }else
    {
      this.router.navigate(['/login',{routeData:'/challenge/'+this.challenge.id}]);
    }

  }


  transform(array: Array<any>) {



    var tempArray = [];

    var tempElemente = null;


    for (var n = array.length; n > 1; n = n - 1) {


      for (var i = 0; i < n - 1; i = i + 1) {


        console.log(Date.parse(array[i].publish_date)< Date.parse(array[i + 1].publish_date));
        if (Date.parse(array[i].publish_date)< Date.parse(array[i + 1].publish_date)) {


          tempElemente = array[i];
          array[i] = array[i + 1];
          array[i + 1] = tempElemente;

        } // ende if
      } // ende innere for-Schleife
    }



    return array;

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


  postLike(ideaId, id)
  {




    if(this.authService.isAuthenticated().status) {

      var formData = new FormData();
      formData.append('ideaId', ideaId);
      formData.append('target_publisher_id', this.challenge.ideas[id].publisher_id);
      let headers = new Headers();
      let options = new RequestOptions({headers: headers});


      this._http.put('http://176.9.157.103:4000/api/idealike/' + this.challenge.id, formData, options).subscribe((data) => {

        if (data.json().status == "success") {

          console.log("success");

          this.challenge.ideas[id].likes.push({publisher_id: this.user.id});


        } else {

        }


      });


    }else
    {
      this.router.navigateByUrl('/login');
    }


  }


  unLike(ideaId, id)
  {



    if(this.authService.isAuthenticated().status) {

      var formData = new FormData();
      formData.append('ideaId', ideaId);
      let headers = new Headers();
      let options = new RequestOptions({headers: headers});


      this._http.put('http://176.9.157.103:4000/api/unlikeidea/' + this.challenge.id, formData, options).subscribe((data) => {

        if (data.json().status == "success") {

          console.log("success");
          var removeIndex = this.challenge.ideas[id].likes.map(function (item) {
            return item.publisher_id;
          }).indexOf(this.user.id);

// remove object
          this.challenge.ideas[id].likes.splice(removeIndex, 1);


        } else {




        }


      });

    }
    else
    {
      this.router.navigateByUrl('/login');
    }


  }









  postLikeQ(ideaId, id)
  {




    if(this.authService.isAuthenticated().status) {

      var formData = new FormData();
      formData.append('questionId', ideaId);
      formData.append('target_publisher_id', this.challenge.questions[id].publisher_id);
      let headers = new Headers();
      let options = new RequestOptions({headers: headers});


      this._http.put('http://176.9.157.103:4000/api/questionlike/' + this.challenge.id, formData, options).subscribe((data) => {

        if (data.json().status == "success") {

          console.log("success");

          this.challenge.questions[id].likes.push({publisher_id: this.user.id});


        } else {

        }


      });


    }else
    {
      this.router.navigateByUrl('/login');
    }


  }


  unLikeQ(ideaId, id)
  {



    if(this.authService.isAuthenticated().status) {

      var formData = new FormData();
      formData.append('questionId', ideaId);
      let headers = new Headers();
      let options = new RequestOptions({headers: headers});


      this._http.put('http://176.9.157.103:4000/api/unlikequestion/' + this.challenge.id, formData, options).subscribe((data) => {

        if (data.json().status == "success") {

          console.log("success");
          var removeIndex = this.challenge.questions[id].likes.map(function (item) {
            return item.publisher_id;
          }).indexOf(this.user.id);

// remove object
          this.challenge.questions[id].likes.splice(removeIndex, 1);


        } else {




        }


      });

    }
    else
    {
      this.router.navigateByUrl('/login');
    }


  }


}
