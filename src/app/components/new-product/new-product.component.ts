import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { NgxImageCompressService } from 'ngx-image-compress';
import { AlertsService } from 'src/app/services/alerts.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { ProductsService } from 'src/app/services/products.service';
import { priceValid } from 'src/app/validators/price.Validators'; // Renombré el archivo a "price.validators"

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss'],
})
export class NewProductComponent implements OnInit {
  imgProduct = './assets/no-product-image.png';
  currentFile: Blob[] = []; // Cambié el tipo de "any[]" a "Blob[]"
  categorias: any[] = [];
  formProduct!: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private compressImg: NgxImageCompressService,
    private fb: FormBuilder,
    private categoryService: CategoriesService,
    private _productService: ProductsService,
    private alertS: AlertsService
  ) {
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
      expired: [, Validators.required],
      image: [],
      category_id: [0, Validators.required],
    },
    {
      validators: priceValid,
    });
  }

  getCategorias() {
    this.categoryService.getCategories().subscribe((resp: any) => {
      this.categorias = resp;
    });
  }

  ngOnInit() {}

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
  if (this.formProduct.valid) {
    const formdata = new FormData();
    formdata.append('image', this.currentFile[0]);
    const data = this.formProduct.getRawValue();

    if(this.formProduct.invalid) {
      this.formProduct.markAllAsTouched();
      return;
    }

    for (const dataKey in data) {
      formdata.append(dataKey, data[dataKey]);
    }

    this._productService.newProduct(formdata).subscribe((newProduct) => {
      console.log('Nuevo producto:', newProduct); // Verifica los datos del nuevo producto
      if (newProduct) {
        this._productService.setNewProduct(newProduct);
        this.alertS.generateToast({
          duration: 800,
          color: 'success',
          icon: 'home',
          message: 'Producto creado',
          position: 'top',
        });
      }
    });
  } else {
    console.log('El formulario no es válido');
  }
}


  validarPrecio() {
    return !!this.formProduct?.errors?.['priceError'];
  }
}
