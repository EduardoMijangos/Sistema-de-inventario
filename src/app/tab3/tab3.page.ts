import { Component } from '@angular/core';
import { SalesService } from '../services/sales.service';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  ventas: any[] = [];

  constructor(
    private saleS: SalesService,
    private productsService: ProductsService
  ) {
    this.saleS.getSale().subscribe((sales: any) => {
      const promises = sales.map(async (sale: any) => {
        // Verificar si product_id está definido
        if (sale.product_id) {
          // Use await para obtener el valor del observable
          const product = await this.productsService.getProductById(sale.product_id).toPromise();
          return { ...sale, product_name: product ? product.name : 'Nombre no disponible' };
        } else {
          // Si product_id no está definido, retorna la venta sin información de producto
          return sale;
        }
      });

      // Utiliza Promise.all para esperar todas las promesas
      Promise.all(promises).then((resolvedSales) => {
        this.ventas = resolvedSales;
        console.log(this.ventas);
      });
    });

    this.saleS.getNewSale.subscribe(async (sale: any) => {
      if (sale) {
        // Verificar si product_id está definido
        if (sale.product_id) {
          // Use await para obtener el valor del observable
          const product = await this.productsService.getProductById(sale.product_id).toPromise();
          this.ventas.push({ ...sale, product_name: product ? product.name : 'Nombre no disponible' });
        } else {
          // Si product_id no está definido, agrega la venta sin información de producto
          this.ventas.push(sale);
        }
      }
    });
  }

  titulo = 'Reportes';

  onSearchChange(event: any) {
    console.log('HOLA');
  }
}
