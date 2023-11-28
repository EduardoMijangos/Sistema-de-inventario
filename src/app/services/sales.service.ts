import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';

const URL = 'http://localhost:8000/api';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  getNewSale: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) { }

  postSale(data: any) {
    return this.http.post(`${URL}/nuevoSale`, data);
  }

  getSale() {
    return this.http.get(`${URL}/sales`);
  }

  setNewSale(sales: any) {
    this.getNewSale.emit(sales);
  }
}
