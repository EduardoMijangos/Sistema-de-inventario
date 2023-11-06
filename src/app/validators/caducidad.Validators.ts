import { AbstractControl, ValidationErrors } from "@angular/forms";
import * as moment from 'moment';

export function caducidadValid(ctrl: AbstractControl): ValidationErrors | null{
const caducidad = ctrl?.get('expired')?.value;
console.log(caducidad);
const fechaCaducidad = moment(caducidad);
//console.log('fecha de caducidad',fechaCaducidad);
const hoy = moment().format();
//console.log('fecha de hoy',hoy);

const fechaAnterior = fechaCaducidad.isBefore(hoy);
//console.log('Fecha anterior', fechaAnterior);

if (fechaAnterior ){
    console.log('Fecha anterior en el if', fechaAnterior);
    
    return ({ 'expiredError':true});
}

return null;
}