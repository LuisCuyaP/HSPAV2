import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Property } from 'src/app/model/property';
import { HousingService } from 'src/app/services/housing.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyDetailResolverService implements Resolve<Property> {

constructor(private router: Router ,private housingService: HousingService) { }

resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
  Observable<Property> | Property {
    //aqui captura el id que mandan por la ruta en el boton detalle del prop card, como es un resolver service del detail y en la ruta mandan
   //al detail llega por aca 
    const propId = route.params['id']
    //aca ingresa al api y el return del resultado se almacena en prp (prp esta declarado en el app.module.ts --> resolve = {prp :...})
    return this.housingService.getProperty(+propId).pipe(
        catchError(error => {
          this.router.navigate(['/']);
          return of(null);
        })
    );
}

}
