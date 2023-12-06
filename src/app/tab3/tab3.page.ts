// tab3.page.ts

import { Component, Input, OnInit } from '@angular/core';
import { SalesService } from '../services/sales.service';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  ventas: any[] = [];
  mostSoldProducts: any[] = [];
  productImage: string | null = null;


  constructor(
    private saleS: SalesService,
    private productsService: ProductsService,
  ) {
    this.saleS.getSale().subscribe((sales: any) => {
      const promises = sales.map(async (sale: any) => {
        // Verificar si product_id está definido
        if (sale.product_id) {
          try {
            // Utilizar la función getProductById del ProductsService
            const product = await this.productsService.getProductById(sale.product_id).toPromise();

            return {
              ...sale,
              product_name: product ? product.name : 'Nombre no disponible',
              product_image: product ? product.image : null,
              product_price: product ? product.price : null,
              // Agregar más propiedades según sea necesario
            };
          } catch (error) {
            console.error(`Error obteniendo detalles del producto para la venta con ID ${sale.id}:`, error);
            // Retornar la venta sin detalles en caso de error
            return sale;
          }
        }
        return sale; // Si product_id no está definido, retornar la venta sin cambios
      });

      // Utiliza Promise.all para esperar todas las promesas
      Promise.all(promises).then((resolvedSales) => {
        this.ventas = resolvedSales;

        // Llamar a la función para obtener la lista de productos más vendidos
        this.getMostSoldProducts();
      });
    });

    this.saleS.getNewSale.subscribe(async (sale: any) => {
      if (sale) {
        // Verificar si product_id está definido
        if (sale.product_id) {
          try {
            // Utilizar la función getProductById del ProductsService
            const product = await this.productsService.getProductById(sale.product_id).toPromise();

            this.ventas.push({
              ...sale,
              product_name: product ? product.name : 'Nombre no disponible',
              product_image: product ? product.image : null,
              product_price: product ? product.price : null,
              // Agregar más propiedades según sea necesario
            });
          } catch (error) {
            console.error(`Error obteniendo detalles del producto para la venta con ID ${sale.id}:`, error);
            // Agregar la venta sin detalles en caso de error
            this.ventas.push(sale);
          }
        } else {
          // Si product_id no está definido, agrega la venta sin información de producto
          this.ventas.push(sale);
        }
      }
    });
  }

  ngOnInit(): void {
    this.productsService.productImage$.subscribe((image) => {
      this.productImage = image;
    });
  }  

  private getMostSoldProducts() {
    // Ordenar la lista de ventas por cantidad de forma descendente
    this.ventas.sort((a, b) => b.amount - a.amount);
  
    // Tomar los primeros 3 elementos (los más vendidos)
    const top3MostSold = this.ventas.slice(0, 3);
  
    // Imprimir la lista de los 3 productos más vendidos en la consola
    console.log(top3MostSold);
  
    // Puedes asignar top3MostSold a this.mostSoldProducts si deseas utilizarlo en la plantilla
    this.mostSoldProducts = top3MostSold;
  }

  descargarPDF() {
    // Llamar a la función para generar y descargar el PDF
    this.saleS.generatePDF(this.ventas);
  }

  onSearchChange(event: any) {
    console.log('HOLA');
  }

  imagenNoEncontrada(event: Event) {
    console.error('Error al cargar la imagen:', event);
    // Puedes manejar este evento según tus necesidades
  }
}
