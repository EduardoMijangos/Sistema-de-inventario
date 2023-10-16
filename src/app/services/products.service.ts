import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
const URL = 'http://localhost:8000/api/';
@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(
    private http: HttpClient
  ) { }

//* Nuevo Producto
  newProduct(data: any){
   return this.http.post(`${URL}nuevoProducto`, data);
  }
//* Obtener productos */
getProducts(){
  return this.http.get(`${URL}productos`);
}

}
