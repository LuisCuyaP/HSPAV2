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
  property = new Property();
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private route: ActivatedRoute, 
              private router: Router,
              private housingService: HousingService) { }

  ngOnInit() {
    this.propertyId = +this.route.snapshot.params['id'];

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
    this.route.data.subscribe(
      (data: Property) => {
        this.property = data['prp'];
      }
    );

    this.galleryOptions = [
      {
        width: '100%',
        height: '465px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: true
      }
    ];

    this.galleryImages = [
      {
        small: 'assets/images/prop-1.jpg',
        medium: 'assets/images/prop-1.jpg',
        big: 'assets/images/prop-1.jpg'
      },
      {
        small: 'assets/images/prop-2.jpg',
        medium: 'assets/images/prop-2.jpg',
        big: 'assets/images/prop-2.jpg'
      },
      {
        small: 'assets/images/prop-3.jpg',
        medium: 'assets/images/prop-3.jpg',
        big: 'assets/images/prop-3.jpg'
      },
      {
        small: 'assets/images/prop-4.jpg',
        medium: 'assets/images/prop-4.jpg',
        big: 'assets/images/prop-4.jpg'
      },
      {
        small: 'assets/images/prop-5.jpg',
        medium: 'assets/images/prop-5.jpg',
        big: 'assets/images/prop-5.jpg'
      }
    ];
    
  }

  onSelectNext(){
    this.propertyId += 1;
    this.router.navigate(['property-detail', this.propertyId]);
  }

}
