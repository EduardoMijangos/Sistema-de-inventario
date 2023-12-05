import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
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
  filtroproducts: any[] = [];
  caduca: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private _categoryService: CategoriesService,
    private _productService: ProductsService,
    private alertS: AlertsService,
    private alertCtrl: AlertController
  ) {
    this._categoryService.getNewCategory.subscribe((category: any) => {
      if (category) {
        this.categories.push(category);
        this.filtrocategories.push(category); // Agregar la categoría al filtro
      }
    });

    this._productService.getNewProduct.subscribe((product: any) => {
      if (product) {
        this.getProducts();
        this.products.push(product);
        this.filtrarCat(); // Refiltrar productos cuando se agrega uno nuevo
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

  filtrarCat(id?: number) {
    if (id !== undefined) {
      this.filtroproducts = this.products.filter(product => product.category_id === id);
    } else {
      // Si no se selecciona ninguna categoría, mostrar todos los productos
      this.filtroproducts = [...this.products];
    }
  }

  getCategorias() {
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
      this.filtrarCat(); // Filtrar productos cuando se cargan
    });
  }
  onSearchChange(event: any) {
    const searchTerm = event.target.value.toLowerCase();
  
    if (searchTerm.trim() !== '') {
      // Si hay un término de búsqueda, filtrar los productos
      this.filtroproducts = this.products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.stock.toString().includes(searchTerm) ||
        product.price.toString().includes(searchTerm)
      );
    } else {
      // Si el término de búsqueda está vacío, mostrar todos los productos
      this.filtrarCat();
    }
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
    // Obtén el nombre de la categoría a través del ID
    const category = this.categories.find(cat => cat.id === product.category_id);
  
    const modal = await this.modalCtrl.create({
      component: ViewProductComponent,
      componentProps: {
        product: { ...product, categoryName: category ? category.name : '' }
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

  async deleteProduct(productId: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      mode: 'ios',
      message: '¿Seguro que deseas eliminar este producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (cancel) => {
            console.log('Cancelado');
          }
        }, {
          text: 'Sí',
          handler: () => {
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
                this.products = this.products.filter(product => product.id !== productId);
                  this.filtrarCat();
              },
              (error) => {
                console.error('Error al eliminar el producto', error);
              }
            );
          }
        }
      ]
    });
  
    await alert.present();
  }
  

  async openEditProduct(product: any) {
    const modal = await this.modalCtrl.create({
      component: NewProductComponent,
      mode: 'ios',
      componentProps: {
        datakey: product
      },
      initialBreakpoint: 0.9,
      backdropDismiss: false,
    });
    await modal.present();
  }

  mostrarTodos() {
    // Mostrar todos los productos
    this.filtroproducts = [...this.products];
  }
}

