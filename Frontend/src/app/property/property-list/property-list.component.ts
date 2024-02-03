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
        this.properties = data;
        console.log(this.route.snapshot.url.toString());
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
