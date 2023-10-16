import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';

const URL = 'http://localhost:8000/api/';
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  getNewCategory: EventEmitter<any> = new EventEmitter();

  constructor(
    private http: HttpClient
  ) { }



  newCategory( category : any ) {
   return  this.http.post( URL + 'nuevaCategoria', category);
  }

  getCategories(){
    return this.http.get( URL + 'categorias');
  }

  // * Emitters
  setNewCategory( category : any){
    this.getNewCategory.emit( category );
  }


}
