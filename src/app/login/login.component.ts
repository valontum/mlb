import { Component, OnInit } from '@angular/core';
import {Http, RequestOptions} from '@angular/http';
import {Headers} from '@angular/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, Router} from "@angular/router";
import {AuthService} from '../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

@Injectable()
export class LoginComponent implements OnInit {

  registerFormShow: Boolean = false;
  moreInfo = "";
  filesToUpload: Array<File>;
  routeData = null;

  constructor(private _http: Http, private router: Router, private authService: AuthService, private route: ActivatedRoute) {


    this.routeData = this.route.snapshot.params['routeData'];
    console.log(this.routeData);



  }

  ngOnInit() {


  }





  newUser = {
    name : "",
    email : "",
    password: "",
    repeatPassword : "",
    profileDescription : "",
    file: null

  }



  fileChange(evt){

    var files = evt.target.files;
    var file = files[0];

    this.newUser.file = file;


  }



  login()
  {
    if (this.newUser.email == "" || this.newUser.password == "" )
    {
      this.moreInfo = "Please fill all fields!";
    }
    else
    {
      this.moreInfo = "";
      var formData = new FormData();
      let headers = new Headers();



      formData.append('password', this.newUser.password);
      formData.append('email', this.newUser.email);
      let options = new RequestOptions({ headers: headers });


      this._http.post('http://176.9.157.103:80/api/authenticate', formData,{headers:headers}).subscribe((data) => {

        if (data.json().status == "Incorrect Email or Password") {

          this.moreInfo = "Incorrect Email or Password";

        }
        else if(data.json().status == "User dn")
        {
          this.moreInfo = "User doesn't exist!";
        }
        else if(data.json().status == "Success")
        {

          window.localStorage.setItem('auth_key',data.json().user.token);
          window.localStorage.setItem('user_id',data.json().user.id);
          window.localStorage.setItem('user_name',data.json().user.name);
          this.authService.setUser(data.json().user);

          this.navigate();
        }


      });

    }
  }



  navigate()
  {

    console.log(this.routeData == null || this.routeData =="");
    if(this.routeData == null || this.routeData =="")
    {
      this.router.navigateByUrl('/challenges');
    }
    else
    {

      this.router.navigateByUrl(this.routeData);
    }
  }

  makeRequest() {




    if (this.newUser.name =="" || this.newUser.email == "" || this.newUser.password == "" || this.newUser.profileDescription == "")
    {
      this.moreInfo = "Please fill all fields!";
    }
    else
    {


      if(this.newUser.password != this.newUser.repeatPassword)
      {
          this.moreInfo = "Passwords not identical!"
      }else
      {


        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.newUser.email)))
        {
          this.moreInfo = "Incorrect email";

        }else
        {
          this.moreInfo = "";
          var formData = new FormData();
          let headers = new Headers();



          formData.append('name', this.newUser.name);
          formData.append('email', this.newUser.email);
          formData.append('password', this.newUser.password);
          formData.append('description', this.newUser.profileDescription);

          if(this.newUser.file!=null)
          {
            formData.append('pict', this.newUser.file, this.newUser.file.name);
          }



          //headers.append('Content-Type', 'multipart/form-data');
          let options = new RequestOptions({ headers: headers });




          this._http.post('http://176.9.157.103:80/api/register', formData,{headers:headers}).subscribe((data) => {

            if (data.json().status == "User exists") {

              this.moreInfo = "User Exists";

            } else
            {
              window.localStorage.setItem('auth_key',data.json().user.token);
              window.localStorage.setItem('user_id',data.json().user.id);
              window.localStorage.setItem('user_name',data.json().user.name);
              this.authService.setUser(data.json().user);

              this.router.navigate(['/challenges']);
            }


          });

        }




      }

    }




  }

}
