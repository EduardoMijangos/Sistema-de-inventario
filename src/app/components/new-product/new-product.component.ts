import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { NgxImageCompressService } from 'ngx-image-compress';
import { AlertsService } from 'src/app/services/alerts.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { ProductsService } from 'src/app/services/products.service';
import { caducidadValid } from 'src/app/validators/caducidad.Validators';
import { priceValid } from 'src/app/validators/price.Validators'; // Renombré el archivo a "price.validators"

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss'],
})
export class NewProductComponent implements OnInit {
  imgProduct = './assets/no-product-image.png';
  currentFile: any[] = [];
  categorias: any[] = [];
  formProduct!: FormGroup;
  caduca: boolean = false;
  edit: boolean = false;
  productId = 0;

  constructor(
    private modalCtrl: ModalController,
    private compressImg: NgxImageCompressService,
    private fb: FormBuilder,
    private categoryService: CategoriesService,
    private productService: ProductsService,
    private alertS: AlertsService,
    private _nParams: NavParams
  ) {
    let info = this._nParams.get('datakey');
    console.log(info);

    if (info) {
      this.edit = true;
      this.productId = info.id; // Asigna el ID del producto
      this.imgProduct = info.image;
      this.titulo = 'Editar Producto';
    }
    console.log(info);
    this.getCategorias();
    this.formProduct = this.fb.group({
      name: [
        ,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(1),
        ],
      ],
      price: [0, Validators.required],
      price_sale: [0, Validators.required],
      stock: [0, Validators.required],
      expired: [null],
      image: [],
      category_id: [0, Validators.required],
    },
    {
      validators: [priceValid, caducidadValid],

    });
    this.formProduct.reset(info);
  }

    addEditar(){
    this.edit = !this.edit;
    
}

  getCategorias() {
    this.categoryService.getCategories().subscribe((resp: any) => {
      this.categorias = resp;
    });
  }

  ngOnInit() {}
  titulo = 'Nuevo Producto';

  imageProduct(ev: any) {
    console.log(ev);
    this.compressImg.uploadFile().then(({ image, orientation }) => {
      this.generarURL(image);
      const blob = this.dataURItoBlob(image);
      this.currentFile[0] = blob;
    });
  }

  dataURItoBlob(dataURI: any): Blob {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    const byteString = atob(dataURI.split(',')[1]);
    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  generarURL(image: any) {
    const byteString = atob(image.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: '' });
    // Crear la URL de la imagen
    const imageUrl = URL.createObjectURL(blob);
    console.log(imageUrl);
    // Utilizar la URL de la imagen
    this.imgProduct = imageUrl;
    document.getElementById('imgProd')?.setAttribute('src', imageUrl);
    // this.formProduct.get('image').patchValue(imageUrl); // Comenté esta línea ya que "image" es parte del formulario, no un campo independiente
  }

  async close() {
    await this.modalCtrl.dismiss();
  }

  validaCtrl(control: string) {
    return !!this.formProduct.get(control)?.errors && this.formProduct.get(control)?.touched;
  }

  submit() {
    console.log(this.formProduct.errors);
    const formdata = new FormData();
    let data = this.formProduct.getRawValue();
    for (const dataKey in data) {
      formdata.append(dataKey, data[dataKey]);
    }
    if (this.currentFile) {
      formdata.append('image', this.currentFile[0]);
    }
    console.log('Formdata', formdata);
    if (this.edit) {
      console.log('Actualizar producto');
      this.productService.newProduct(formdata).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          this.productService.setNewProduct(resp);
          this.alertS.generateToast({
            duration: 2000,
            color: 'success',
            icon: 'checkmark-circle',
            message: 'Producto creado',
            position: 'top',
          });
          this.modalCtrl.dismiss();
          this.formProduct.reset();
        }
      });
    } else {
      this.productService.updateProduct(formdata, this.productId).subscribe(
        (resp: any) => {
          console.log(resp);
          if (resp) {
            this.productService.setNewProduct(resp);
            this.alertS.generateToast({
              duration: 2000,
              color: 'success',
              icon: 'checkmark-circle',
              message: 'Producto actualizado',
              position: 'top',
            });
            this.modalCtrl.dismiss();
            this.formProduct.reset();
          }
        }
      );
    }
  }


  validarPrecio() {
    return !!this.formProduct?.errors?.['priceError'];
  }

  addCaducidad(){
    this.caduca = !this.caduca
  }


validaExpired(){
  return !!this.formProduct?.errors?.['expiredError']
}
}
