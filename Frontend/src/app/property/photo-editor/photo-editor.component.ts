import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Photo } from 'src/app/model/photo';
import { Property } from 'src/app/model/property';
import { AlertifyService } from 'src/app/services/alertify.service';
import { HousingService } from 'src/app/services/housing.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  //usamos el decorador input para declarar la variable y asi el component principal pase info a este componente
  //entonces property ya tiene toda la info de la entidad [property] del componente property Detail
  @Input() property: Property;

  //se usa para generar un evento y notificar al componente principal, eso quiere decir que de este componente enviare un metodo al componente padre que seria  al property Detail
  //hacemos esto para mandar la url al component detail y se refresque la pagina para ver los cambios
  //el output siempre va de la mano con el EventEmitter
  @Output() mainPhotoChangedEvent = new EventEmitter<string>();

  uploader: FileUploader;
  baseUrl= environment.baseUrl;
  maxAllowedFileSize= 10*1024*1024;

  constructor(private housingService: HousingService, private alertify: AlertifyService) { }
  
  //a este metodo lo llamamos en el onInit para obtener el propertyId, si lo llamamos en el constructor
  //obtendremos el id en blanco
  initializerFileUploader(){
    this.uploader = new FileUploader({
      url: this.baseUrl + '/property/add/photo/' + String(this.property.id),
      authToken: 'Bearer '+ localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: true,
      maxFileSize: this.maxAllowedFileSize
    });

    //agrego este metodo para solucionar los errores de cors con ng2fileUpload(las direcciones de la api y el front son distintas [4200 y 5000]) para solucionarlo, luego de agregar la foto las credenciales lo seteo en false
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    //con este metodo puedo controlar despues de que termino de cargar las imagenes
    //entonces aqui actualizo el listado de fotos para que se pueda mostrar en el formulario las fotos recien agregadas
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if(response){
        const photo = JSON.parse(response);
        this.property.photos.push(photo);
      }
    };
  }

  mainPhotoChanged(url: string){
    //aqui mando al componetne princiap la url de la imagen que sera primaria
    this.mainPhotoChangedEvent.emit(url);
  }


  ngOnInit(): void {
    this.initializerFileUploader();
  }

  setPrimaryPhoto(propertyId: number, photo: Photo) {
    this.housingService.setPrimaryPhoto(propertyId,photo.publicId).subscribe(()=>{
        this.mainPhotoChanged(photo.imageUrl);
        this.property.photos.forEach(p => {
            if (p.isPrimary) {p.isPrimary = false;}
            if (p.publicId === photo.publicId) {p.isPrimary = true;}
        });
    });
}

deletePhoto(propertyId: number, photo: Photo) {
    this.housingService.deletePhoto(propertyId,photo.publicId).subscribe(()=>{
        this.property.photos = this.property.photos.filter(p =>
            p.publicId !== photo.publicId);
    });
}
}
