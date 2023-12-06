import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ProductsService } from './products.service';
import { Observable } from 'rxjs';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  getNewSale: EventEmitter<any> = new EventEmitter();
  private apiUrl = 'http://localhost:8000/api'; // Configurar la URL base aquí

  constructor(
    private http: HttpClient,
    private productsService: ProductsService
  ) {}

  postSale(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/nuevoSale`, data);
  }

  getSale(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sales`);
  }

  setNewSale(sales: any): void {
    this.getNewSale.emit(sales);
  }

  async getMostSoldProducts(ventas: any[]): Promise<any[]> {
    const promises = ventas.map(async (venta: any) => {
      if (venta.product_id) {
        try {
          const product = await this.productsService.getProductById(venta.product_id).toPromise();

          const productDetails: any = {
            id: product.id,
            name: product.name,
            category: product.category_id,
            precio: product.price,
          };

          if (product.image) {
            productDetails.image = product.image;
          }

          return {
            ...venta,
            productDetails,
          };
        } catch (error) {
          console.error(`Error obteniendo detalles del producto para la venta con ID ${venta.id}:`, error);
          return venta;
        }
      }

      return venta;
    });

    return Promise.all(promises);
  }

  generatePDF(ventas: any[]): void {
    const documentDefinition = {
      content: [
        {
          text: 'Reporte de productos', style: 'header'
        },
        '\n\n',
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto', 'auto'],
            body: [
              ['Nombre del producto', 'Precio', 'Precio Venta', 'Cantidad', 'Ganancia'],
              ...ventas.map((p: any) => [p.product.name, p.product.price, p.product.price_sale, p.amount, p.profit])
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

    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
    pdfDocGenerator.download('Reporte_de_productos.pdf');
  }
}
