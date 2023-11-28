import { AbstractControl, ValidatorFn, ValidationErrors } from "@angular/forms";


export function stockVentasValidate(ctrl: AbstractControl):ValidationErrors | null{
  const stock:number = ctrl?.get('amount')?.value;

  console.log('Tu numero', stock);

  if(stock <= 0){
    console.log('stock no  valido')
    return ({'stockError': true})
  }

  console.log('stock valido')
  return null

}
