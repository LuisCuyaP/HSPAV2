import { Component, OnInit } from '@angular/core';
import { HousingService } from 'src/app/services/housing.service';
import { IProperty } from '../IProperty.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent implements OnInit {
  SellRent = 1;
  properties: IProperty[];

  constructor(private route: ActivatedRoute, private housingService: HousingService) { }

  ngOnInit(): void {
    //si estoy en el frm de rent muestra solo las casas de rent tipo 2
    if(this.route.snapshot.url.toString()){
      this.SellRent = 2;
    }

    //aca traigo las casas de tipo rent 2
    this.housingService.getAllProperties(this.SellRent).subscribe(
      data =>{
        //aca obtengo las propiedades segun el tipo de sellrent, ya sea tipo 1 o 2
        this.properties = data;

        //aca obtengo la nueva propiedad que acabo de guardar
        //const newProperty= JSON.parse(localStorage.getItem('newProp'));

        //si mi nueva propiedad que guarde es de tipo 1 y obviamente le digo que este sellrent sea de tipo uno antes de guardarlo en el add properti
        //aca antes de llegar, cuando hago el submit defino el this.sellrent, si mi nueva propiedad es de tipo 1 o 2 en mi on submit le dire que this.sellrente se aca de agrega un tipo 1 o 2
        //if(newProperty.SellRent === this.SellRent){
          //entonces aca agrego la nueva propiedad, y como en mi html lo abasteco con properties entonces me mostrara el json con la nueva propiedad ingresada
        //  this.properties = [newProperty, ...this.properties];
        //}




        console.log(this.route.snapshot.url.toString());
        console.log(data);
      }, error => {
        console.log(error);
      }
    )
    // this.http.get('data/properties.json').subscribe(
    //   data=>{
    //     this.properties = data;
    //     console.log(data)
    //   }
    // );
  }

}
