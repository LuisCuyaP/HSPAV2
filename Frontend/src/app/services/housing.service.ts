import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IProperty } from '../property/IProperty.interface';
import { Observable } from 'rxjs';
import { Property } from '../model/property';

@Injectable({
  providedIn: 'root'
})
export class HousingService {

  constructor(private http: HttpClient) { }

  getAllCities(): Observable<string[]>{
    return this.http.get<string[]>('http://localhost:5000/api/city');
  }

  getProperty(id: number){
    return this.getAllProperties().pipe(
      map(propertiesArray => {
        //throw new Error('Some error');
        return propertiesArray.find(p => p.Id === id) as Property;
      })
    );
  }

  getAllProperties(SellRent?: number): Observable<Property[]>{
    return this.http.get('data/properties.json').pipe(
      map(data => {
        //aca se escoge la clase Property porque estoy agregando una nueva propiedad con todos sus elementos
        const propertiesArray: Array<Property> = [];
        const localProperties = JSON.parse(localStorage.getItem('newProp'));
    
        if(localProperties){
          for(const id in localProperties){
            if(SellRent){
              if(localProperties.hasOwnProperty(id) && localProperties[id].SellRent === SellRent){
                propertiesArray.push(localProperties[id]);
              }
            }else{
              propertiesArray.push(localProperties[id]);
            }           
          }
        }

        for(const id in data){
          if(SellRent){
            if(data.hasOwnProperty(id) && data[id].SellRent === SellRent){
              propertiesArray.push(data[id]);
            }
          }else{
            propertiesArray.push(data[id]);
          }
       
        }
        return propertiesArray;
      })
    );

    return this.http.get<Property[]>('data/properties.json');
  }

  addProperty(property: Property) {
    //aca lo convierto en un array
    let newProp = [property];

    //si agrego una nueva propiedad en el array , y su newProp ya existe entonces agregalo al array
    if(localStorage.getItem('newProp')){
      newProp = [property,
                  ...JSON.parse(localStorage.getItem('newProp'))];      
    }

    localStorage.setItem('newProp', JSON.stringify(newProp));
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
  
  
}
