import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IProperty } from '../property/IProperty.interface';
import { Observable } from 'rxjs';
import { Property } from '../model/property';
import { environment } from 'src/environments/environment';
import { Ikeyvaluepair } from '../model/ikeyvaluepair';

@Injectable({
  providedIn: 'root'
})
export class HousingService {
  baseUrl = environment.baseUrl;


  constructor(private http: HttpClient) { }

  getAllCities(): Observable<string[]>{
    return this.http.get<string[]>('http://localhost:5000/api/city');
  }

  getPropertyTypes(): Observable<Ikeyvaluepair[]> {
    return this.http.get<Ikeyvaluepair[]>(this.baseUrl + '/propertytype/list');
  }

  getFurnishingTypes(): Observable<Ikeyvaluepair[]> {
    return this.http.get<Ikeyvaluepair[]>(this.baseUrl + '/furnishingtype/list');
  }

  getProperty(id: number){
    // return this.getAllProperties(1).pipe(
    //   map(propertiesArray => {
    //     //throw new Error('Some error');
    //     return propertiesArray.find(p => p.id === id) as Property;
    //   })
    // );
    return this.http.get<Property>(this.baseUrl + '/property/detail/'+id.toString());
  }

  getAllProperties(SellRent?: number): Observable<Property[]>{
    return  this.http.get<Property[]>(this.baseUrl + '/property/list/' + SellRent.toString())
    // return this.http.get('data/properties.json').pipe(
    //   map(data => {
    //     //aca se escoge la clase Property porque estoy agregando una nueva propiedad con todos sus elementos
    //     const propertiesArray: Array<Property> = [];
    //     const localProperties = JSON.parse(localStorage.getItem('newProp'));
    
    //     if(localProperties){
    //       for(const id in localProperties){
    //         if(SellRent){
    //           if(localProperties.hasOwnProperty(id) && localProperties[id].SellRent === SellRent){
    //             propertiesArray.push(localProperties[id]);
    //           }
    //         }else{
    //           propertiesArray.push(localProperties[id]);
    //         }           
    //       }
    //     }

    //     for(const id in data){
    //       if(SellRent){
    //         if(data.hasOwnProperty(id) && data[id].SellRent === SellRent){
    //           propertiesArray.push(data[id]);
    //         }
    //       }else{
    //         propertiesArray.push(data[id]);
    //       }
       
    //     }
    //     return propertiesArray;
    //   })
    // );

    // return this.http.get<Property[]>('data/properties.json');
  }

  addProperty(property: Property) {
    //aca lo convierto en un array
    // let newProp = [property];

    // //si agrego una nueva propiedad en el array , y su newProp ya existe entonces agregalo al array
    // if(localStorage.getItem('newProp')){
    //   newProp = [property,
    //               ...JSON.parse(localStorage.getItem('newProp'))];      
    // }

    // localStorage.setItem('newProp', JSON.stringify(newProp));
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer '+ localStorage.getItem('token')
      })
    };
    return this.http.post(this.baseUrl + '/property/add', property, httpOptions);
  }

  newPropId(){
    if(localStorage.getItem('PID')){
      localStorage.setItem('PID', String(+localStorage.getItem('PID') + 1));
      return +localStorage.getItem('PID');
    }else{
      localStorage.setItem('PID', '101');
      return 101;
    }
  }

  getPropertyAge(dateofEstablishment: string): string{
    //obtenemos la fecha actuañ
    const today = new Date();
    const estDate = new Date(dateofEstablishment);
    let age = today.getFullYear() - estDate.getFullYear();
    const m = today.getMonth() - estDate.getMonth();


    //aqui estamos comprobando si el mes de la fecha actual es menor que el mes
    //de la fecha de establecimiento o si el mes es el mismo
    // Current month smaller than establishment month or
    // Same month but current date smaller than establishment date
    if (m < 0 || (m === 0 && today.getDate() < estDate.getDate())) {
        age --;
    }

    // Establshment date is future date
    if(today < estDate) {
        return '0';
    }

    // Age is less than a year
    if(age === 0) {
      return 'Less than a year';
    }

    return age.toString();
  }
  
  setPrimaryPhoto(propertyId: number, propertyPhotoId: string) {
    const httpOptions = {
        headers: new HttpHeaders({
            Authorization: 'Bearer '+ localStorage.getItem('token')
        })
    };
    return this.http.post(this.baseUrl + '/property/set-primary-photo/'+String(propertyId)
        +'/'+propertyPhotoId, {}, httpOptions);
  }

  deletePhoto(propertyId: number, propertyPhotoId: string) {
    const httpOptions = {
        headers: new HttpHeaders({
            Authorization: 'Bearer '+ localStorage.getItem('token')
        })
    };
    return this.http.delete(this.baseUrl + '/property/delete-photo/'
        +String(propertyId)+'/'+propertyPhotoId, httpOptions);

        
  }
  
}
