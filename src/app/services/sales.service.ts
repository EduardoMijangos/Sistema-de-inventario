import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

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

/*   async reporte(ventas:any[]){
    function buildTableBody(data: any, colums: any){
      const body = [];
      data.forEach((row:any)=>{
        const dataRow:any[]=[];
        colums.forEach((colum:any)=> {
          const obj = {
            text: row['hola'],
            style: 'subheader'
          };
          dataRow.push(obj);
        });
        body.push(dataRow);
      });
      const obj2 = [{ 
        fontSiz:16, bold: true, text:'Total', style:'subheader' }, {
        fontSiz:16, bold: true, text:'1500', style:'subheader' 
      }];
      body.push(obj2)
    }
  } */

  generatePDF(ventas: any) {
    // Definir el contenido del PDF
    const documentDefinition = {
      content: [
        {
          text: 'Reporte de productos', style: 'header'
        },
        '\n\n',
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Nombre del producto', 'Precio', 'Cantidad', 'Ganancia'],
              ...ventas.map( (p: any) => [ p.product.name, p.product.price, p.amount, p.profit])
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true
        }
      }
    };
  
    // Crear el PDF
    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
  
    // Descargar el PDF
    pdfDocGenerator.download('Reportede_productos.pdf');
  } 
}
