import {Injectable} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';
import {Headers} from '@angular/http';

@Injectable()

export class AuthService {

  constructor(private _http:Http) {

  }

  private user = {
    id:null,
    name:null,
    email:null,
    notifications : null,
    openNotifications : null
  }


  setUser(user)
  {
    this.user.name = user.name;
    this.user.email = user.email;
    this.user.id = user.id;
  }

  setUserFromChache()
  {
    this.user.id = window.localStorage.getItem('user_id');
    this.user.name = window.localStorage.getItem('user_name');
  }

  getUser()
  {

    return this.user;
  }

  getNotifications()
  {
    let headers = new Headers();

    return  this._http.get('http://localhost:3000/api/notificationsstatus/'+this.user.id,{headers:headers});

  }

  isAuthenticated()
  {
      if(window.localStorage.getItem('auth_key')=="" || window.localStorage.getItem('auth_key')==null)
      {
        return {status:false};
      }
      else
      {
        return {status:true};
      }
  }

  signOut()
  {
    window.localStorage.removeItem('auth_key');
    window.localStorage.removeItem('user_name');
    window.localStorage.removeItem('user_id');

    let headers = new Headers();

    this._http.get('http://localhost:3000/api/logout',{headers:headers}).subscribe((data) => {




    });


  }






}
