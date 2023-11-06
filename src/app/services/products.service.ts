import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const URL = 'http://localhost:8000/api';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  // Declarar el EventEmitter para el nuevo producto
  getNewProduct: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) {}

  // Nuevo Producto
  newProduct(products: any) {
    return this.http.post(`${URL}/nuevoProducto`, products);
  }

  // Obtener productos
  getProducts() {
    return this.http.get(`${URL}/productos`);
  }

  // Emisor para el nuevo producto
  setNewProduct(products: any) {
    this.getNewProduct.emit(products);
  }

  deleteProduct(productId: number) {
    return this.http.delete(`${URL}/eliminarProducto/${productId}`);
  }
  
}
