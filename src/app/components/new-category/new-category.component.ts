import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CategoriesService } from '../../services/categories.service';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.scss'],
})
export class NewCategoryComponent  implements OnInit {

  formCategory!: FormGroup;
  colores = [ 'success', 'danger', 'primary', 'warning' ];


  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private _categoryService: CategoriesService,
    private _alertService: AlertsService
     ) {

      this.formCategory = this.fb.group({
        name : [null, Validators.required],
        color : [null, Validators.required]
      });

      }

  ngOnInit() {}

  async close() {
    await this.modalCtrl.dismiss();
  }

  validaCtrl(control: string){
    return !!this.formCategory.get(control)?.errors && this.formCategory.get(control)?.touched
  }


  submit(){
    console.log(this.formCategory.value);

    if(this.formCategory.invalid) {
      this.formCategory.markAllAsTouched();
      return;
    }

    const data = this.formCategory.value;
    this._categoryService.newCategory(data).subscribe( resp => {
      console.log(resp);
      if(resp){
        //* Seteamos el emmitter
        this._categoryService.setNewCategory(resp);
        this._alertService.generateToast({
          duration:800,  color: 'success', icon: 'home', message: 'Categoria creada', position: 'top'
        })
      }

    } )


  }

}
