import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NewProductComponent } from '../components/new-product/new-product.component';
import { ViewProductComponent } from '../components/view-product/view-product.component';
import { NewSaleComponent } from '../components/new-sale/new-sale.component';
import { NewCategoryComponent } from '../components/new-category/new-category.component';
import { CategoriesService } from '../services/categories.service';
import { ProductsService } from '../services/products.service';
import { AlertsService } from '../services/alerts.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  titulo = 'Mis productos';
  categories: any[] = [];
  products: any[] = [];
  vermas = true;
  filtrocategories: any[] = [];
  filtroproducts: any = [];
  caduca: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private _categoryService: CategoriesService,
    private _productService: ProductsService,
    private alertS: AlertsService
  ) {
    this._categoryService.getNewCategory.subscribe((category: any) => {
      if (category) {
        this.categories.push(category);
      }
    });

    this._productService.getNewProduct.subscribe((product: any) => {
      if (product) {
        this.getProducts();
        this.products.push(product);
      }
    });
  }

  ngOnInit() {
    this.getProducts();
    this.getCategorias();
  }

  verMas() {
    this.vermas = false;
    this.categories = this.filtrocategories;
  }

  verMenos() {
    this.vermas = true;
    this.categories = this.categories.slice(0, 6);
  }

  getCategorias() {
    this.categories = [];
    this._categoryService.getCategories().subscribe((resp: any) => {
      console.log('Categoría', resp);
      this.filtrocategories = resp;
      this.categories = resp;
      this.categories = this.categories.slice(0, 6);
    });
  }

  getProducts() {
    this._productService.getProducts().subscribe((resp: any) => {
      console.log('Productos', resp);
      this.products = resp;
      this.products.reverse();
    });
  }


  onSearchChange(event: any) {
    // Handle search change here
  }

  async openNewProduct() {
    const modal = await this.modalCtrl.create({
      component: NewProductComponent,
      mode: 'ios',
      initialBreakpoint: 0.9,
      backdropDismiss: false,
    });
    await modal.present();
  }


  async openNewSale() {
    const modal = await this.modalCtrl.create({
      component: NewSaleComponent,
      mode: 'ios',
      initialBreakpoint: 0.4,
      backdropDismiss: false,
    });
    await modal.present();
  }

  async openViewProduct(product: any) {
    const modal = await this.modalCtrl.create({
      component: ViewProductComponent,
      componentProps: {
        product: product // Pasa el producto seleccionado al componente de vista de producto.
      },
      mode: 'ios',
      initialBreakpoint: 0.7,
    });
    await modal.present();
  }

  async openNewCategory() {
    const modal = await this.modalCtrl.create({
      component: NewCategoryComponent,
      mode: 'ios',
      initialBreakpoint: 0.4,
      backdropDismiss: false,
    });
    await modal.present();
  }

  onClick() {
    console.log('¡Hola!');
  }

  deleteProduct(productId: number) {
    // Llamada a la función de servicio que envía la solicitud DELETE con el ID del producto
    this._productService.deleteProduct(productId).subscribe(
      (response) => {
        // Manejar la respuesta exitosa aquí
        console.log('Producto eliminado con éxito', response);
        this.alertS.generateToast({
          duration: 800,
          color: 'danger',
          icon: 'trash-outline',
          message: 'Producto eliminado con éxito',
          position: 'top',
        });
        
  
        // Puedes actualizar la lista de productos para reflejar el cambio en la interfaz
        // Por ejemplo, eliminar el producto de la lista local
        this.products = this.products.filter(product => product.id !== productId);
      },
      (error) => {
        // Manejar errores aquí
        console.error('Error al eliminar el producto', error);
      }
    );
  }
  
  async openEditProduct(product: any){
    const modal = await this.modalCtrl.create({
      component: NewProductComponent,
      mode: 'ios',
      componentProps:
      {
        datakey: product
      },
      initialBreakpoint: 0.9,
      backdropDismiss: false,
    });
    await modal.present();
  }
  
  
}
