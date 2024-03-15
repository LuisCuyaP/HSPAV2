import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryImage, NgxGalleryOptions, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { Property } from 'src/app/model/property';
import { HousingService } from 'src/app/services/housing.service';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit {

  public propertyId: number;
  public mainPhotoUrl: string = null;
  property = new Property();
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private route: ActivatedRoute, 
              private router: Router,
              private housingService: HousingService) { }

  ngOnInit() {
    //obtengo el id del ruteo que manda a este componente con el id, desde cuando le doy click en el boton detalle del property card
    //si quito esto ya no chapo el id por la ruta
    //this.propertyId = +this.route.snapshot.params['id'];

    // this.route.params.subscribe(
    //   (params) => {
    //     //captura el id que envio por la url
    //     this.propertyId = +params['id'];
    //     this.housingService.getProperty(this.propertyId).subscribe(
    //       (data: Property) => {
    //         this.property = data;
    //         console.log(data);
    //       }, error => this.router.navigate(['/'])
    //     );
    //   }
    // )

    //aca ingresa a route luego de ingresar al resolver , primero el usuario da click en el botoncito del prop card, luego ingresa
    //al resolver y luego ingresa aqui
    this.route.data.subscribe(
      //aca data se abastece de informacion del resolver service llamanda a la api getProperty
      (data: Property) => {
        //captura el id que envio por la url
        //this.propertyId = 3;

        //este prp viene del resolver y el prp esta declarado en el app.module
        this.property = data['prp'];
        console.log("ver info");
        console.log(data['prp']);
        console.log(this.property.photos);
      }
    );

    this.property.age = this.housingService.getPropertyAge(this.property.estPossessionOn);

    this.galleryOptions = [
      {
        width: '100%',
        height: '465px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: true
      }
    ];

    this.galleryImages = this.getPropertyPhotos();

    // this.galleryImages = [
    //   {
    //     small: 'assets/images/prop-1.jpg',
    //     medium: 'assets/images/prop-1.jpg',
    //     big: 'assets/images/prop-1.jpg'
    //   },
    //   {
    //     small: 'assets/images/prop-2.jpg',
    //     medium: 'assets/images/prop-2.jpg',
    //     big: 'assets/images/prop-2.jpg'
    //   },
    //   {
    //     small: 'assets/images/prop-3.jpg',
    //     medium: 'assets/images/prop-3.jpg',
    //     big: 'assets/images/prop-3.jpg'
    //   },
    //   {
    //     small: 'assets/images/prop-4.jpg',
    //     medium: 'assets/images/prop-4.jpg',
    //     big: 'assets/images/prop-4.jpg'
    //   },
    //   {
    //     small: 'assets/images/prop-5.jpg',
    //     medium: 'assets/images/prop-5.jpg',
    //     big: 'assets/images/prop-5.jpg'
    //   }
    // ];
    
  }

  getPropertyPhotos(): NgxGalleryImage[] {
    const photoUrls: NgxGalleryImage[] = [];
    for(const photo of this.property.photos) {
      //aqui establecemos la foto primaria en el prop detail
      if(photo.isPrimary) {
        this.mainPhotoUrl = photo.imageUrl;
      }else{
        photoUrls.push(
          {
            small: photo.imageUrl,
            medium: photo.imageUrl,
            big: photo.imageUrl
          }
        );
      }
      
    }
    return photoUrls;
  }

  
  changedPrimaryPhoto(mainPhotoUrl: string){
    this.mainPhotoUrl = mainPhotoUrl;
  }

  

  onSelectNext(){
    this.propertyId += 1;
    //con router hago para que vaya a otro componente
    this.router.navigate(['property-detail', this.propertyId]);
  }

}
