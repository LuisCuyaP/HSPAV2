import { Injectable } from '@angular/core';
import { UserForRegister } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

constructor() { }


//este metodo hace agregar arreglo por arreglo en cada add User -> [0], [1]
addUser(user: UserForRegister){    
  let users = [];
  if(localStorage.getItem('Users')){
    users = JSON.parse(localStorage.getItem('Users'));
    users = [user, ...users];
  }else{
    users = [user];
  }

  //con esto muestro en memoria lo que se va almacenando en user(esto se convirtio en tipo arreglo)
  localStorage.setItem('Users', JSON.stringify(users));
}

}
