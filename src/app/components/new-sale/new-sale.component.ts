import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { FilterProductsComponent } from '../filter-products/filter-products.component';
import { ProductsService } from 'src/app/services/products.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { stockVentasValidate } from 'src/app/validators/stockVentas.validator';
import { SalesService } from 'src/app/services/sales.service';
import { AlertsService } from 'src/app/services/alerts.service';

export interface NewSale {
  amount: number;
  total: number;
  profit: number;
  hour: string;
  product_id: string;
  product_name: string;
}

@Component({
  selector: 'app-new-sale',
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.scss'],
})
export class NewSaleComponent implements OnInit {
  color = 'success';
  products: any;
  productsSearch: any[] = [];
  sendSale: any;
  newSale: NewSale = {} as NewSale;

  formCSale: FormGroup = this.fb.group({
    amount: [],
    total: [],
    profit: [],
    hour: [],
    product_id: [],
  }, { validators: [stockVentasValidate] });

  constructor(
    private modalCtrl: ModalController,
    private popController: PopoverController,
    private productService: ProductsService,
    private salesService: SalesService,
    private fb: FormBuilder,
    private alertService: AlertsService
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      console.log('Products retrieved', this.products);
    });
  }

  async close() {
    await this.modalCtrl.dismiss();
  }

  showProduct(e: any) {
    const searchTerm = e.detail.value;
    const filteredProducts: any[] = this.products.filter((product: any) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.presentPopover(filteredProducts);
  }

  validarStock() {
    return !!this.formCSale.errors?.['stockError'];
  }

  async presentPopover(data: any) {
    const pop = await this.popController.create({
      component: FilterProductsComponent,
      event: data,
      side: 'right',
      componentProps: {
        products: data,
      },
    });

    await pop.present();

    const info = await pop.onWillDismiss();
    if (info && info.data) {
      this.sendSale = info.data.item;
      this.productsSearch.push(info);
      if (info.data.item.stock < 15) {
        this.color = 'danger';
      }
    }
  }

  saveSale() {
    const sale = this.formCSale.value;
    const venta: NewSale = {
      amount: sale.amount,
      total: sale.amount * this.sendSale.price,
      profit: sale.amount * this.sendSale.price_sale - sale.amount * this.sendSale.price,
      hour: new Date().toLocaleTimeString(),
      product_id: this.sendSale.id,
      product_name: this.sendSale.name || 'Nombre no disponible', // Asegúrate de tener un valor por defecto si name es undefined
    };

    this.salesService.postSale(venta).subscribe(
      (data) => {
        console.log(data);
        if (data) {
          this.salesService.setNewSale(data);
          this.alertService.generateToast({
            duration: 800,
            color: 'success',
            icon: 'home',
            message: 'Venta creada',
            position: 'top',
          });
        }
      },
      (error) => {
        console.error('Error creating sale', error);
        // Agrega manejo de errores aquí si es necesario
      }
    );

    console.log('Datos registrados', venta);
  }
}