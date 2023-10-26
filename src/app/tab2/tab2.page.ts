import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NewProductComponent } from '../components/new-product/new-product.component';
import { ViewProductComponent } from '../components/view-product/view-product.component';
import { NewSaleComponent } from '../components/new-sale/new-sale.component';
import { NewCategoryComponent } from '../components/new-category/new-category.component';
import { CategoriesService } from '../services/categories.service';
import { ProductsService } from '../services/products.service';

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

  constructor(
    private modalCtrl: ModalController,
    private _categoryService: CategoriesService,
    private _productService: ProductsService
  ) {  }

  ngOnInit() {
    this._categoryService.getNewCategory.subscribe((category: any) => {
      if (category) {
        this.categories.push(category);
      }
    });

    this._productService.getNewProduct.subscribe((product: any) => {
      if (product) {
        this.products.push(product);
      }
    });

    this.getProducts();
    this.getCategorias();
  }

  verMas(){
    this.vermas = false;
    this.categories = this.filtrocategories;
  }

  verMenos(){
    this.vermas = true
    this.categories = this.categories.slice(0, 6);
  }


  getCategorias(){
    this.categories = [];
    this._categoryService.getCategories().subscribe( (resp: any) => {
      console.log('Categoeria', resp);
      this.filtrocategories = resp;
      this.categories = resp;
      this.categories = this.categories.slice(0, 6);

    })
  }

  getProducts(){
    this.products = [];
    this._productService.getProducts().subscribe( (resp: any) => {
      console.log('Products', resp);
      this.products = resp;
    })
  }

  categorias = ['Abarrotes', 'Frutas y verduras', 'Limpieza', 'Vinos y licores', 'Especias', 'Golosinas']

  onSearchChange(event: any){

  }

  async openNewProduct(){
    const modal = await this.modalCtrl.create({
      component: NewProductComponent,
      mode: 'ios',
      initialBreakpoint: .9,
      backdropDismiss:false,
    });
    await modal.present();
  }


  async openNewSale(){
    const modal = await this.modalCtrl.create({
      component: NewSaleComponent,
      mode: 'ios',
      initialBreakpoint: .4,
      backdropDismiss: false,
    });
    await modal.present();
  }


  async openViewProduct(){
    const modal = await this.modalCtrl.create({
      component: ViewProductComponent,
      mode: 'ios'
    });
    await modal.present();
  }


  async openNewCategory(){
    const modal = await this.modalCtrl.create({
      component: NewCategoryComponent,
      mode: 'ios',
      initialBreakpoint: .4,
      backdropDismiss: false,
    });
    await modal.present();
  }



  onClick(){
    console.log('Holaaaa');

  }

}
