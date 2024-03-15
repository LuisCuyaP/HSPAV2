import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, concatMap, retry, retryWhen } from "rxjs/operators";
import { AlertifyService } from "./alertify.service";
import { Observable, of, pipe, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { ErrorCode } from "../enums/enums";

//es necesario agregar este decorador inyectable, de lo contrario la notificacion de alerta no funcionara
@Injectable({
    providedIn: 'root'
})
export class HttpErrorInterceptorService implements HttpInterceptor {

    constructor(private alertify: AlertifyService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler) {
        console.log('HTTP Request started');
        return next.handle(request)
            .pipe(
                //retry -> hace 10 intentos de llamada a la api (metodo de inicio de sesion) se dispara cada vez que el punto final del api arroja un error
                //en este caso un error de unathorized
                //retry(10),
                retryWhen(error => this.retryRequest(error, 10)),
                catchError((error: HttpErrorResponse) => {
                    const errorMessage = this.setError(error);
                    console.log(error);
                    this.alertify.error(errorMessage);
                    return throwError(errorMessage);
                })
            );
    }

    retryRequest(error: Observable<unknown>, retryCount: number) : Observable<unknown> { 
        return error.pipe(
            concatMap((checkErr: HttpErrorResponse, count: number) => {
                if(count <= retryCount)
                {
                    switch(checkErr.status)
                    {
                        case ErrorCode.serverDown :
                            return of(checkErr);
                        
                        //case ErrorCode.unathorized :
                        //    return of(checkErr);
                    }
                }
                //esto signfica que el api no responde
                //aqui necesitamos crear un bucle para llamar al punto final del api
                // if (checkErr.status === ErrorCode.serverDown && count <= retryCount) {
                //     return of(checkErr);
                // }

                //retry en caso el error sea no autorizado
                // if (checkErr.status === ErrorCode.unathorized && count <= retryCount) {
                //     return of(checkErr);
                // }

                return throwError(checkErr);
            })
        );
    }

    setError(error: HttpErrorResponse): string {
        let errorMessage = 'Ocurrio un error desconocido';
        if(error.error instanceof ErrorEvent){
            //error por parte del cliente, en angular
            errorMessage = error.error.message;
        }else{
            if(error.status===401){
                return error.statusText;
            }

            //error por parte del servidor
            //si se obtiene por la console un mensaje de error con status 0 eso quiere decir
            //que el api no responde o esta apagado el back
            if(error.error.errorMessage && error.status !== 0){
                {errorMessage = error.error.errorMessage;}
            }

            if(!error.error.errorMessage && error.error && error.status !== 0){
                {errorMessage = error.error;}
            }
        }
        //si no se conoce el error que esta en los if, en la consola se mostrara el mensaej de Ocurrio un error desconocido
        return errorMessage;
        //return error.error;
    }
}