import { Injectable } from '@angular/core';
import { UserForLogin, UserForRegister } from '../model/user';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

baseUrl = environment.baseUrl;
constructor(private http: HttpClient) { }

authUser(user: UserForLogin){
  //aca en el user lo envio como cuerpo los datos de username y pass en la consulta a la api
  return this.http.post(this.baseUrl + '/account/login', user);
  // let UserArray = [];
  // if(localStorage.getItem('Users')){
  //   UserArray = JSON.parse(localStorage.getItem('Users'));
  // }
  // return UserArray.find(p => p.userName === user.userName && p.password === user.password);
}

registerUser(userRegister: UserForRegister){
  return this.http.post(this.baseUrl + '/account/register', userRegister);
}

}
