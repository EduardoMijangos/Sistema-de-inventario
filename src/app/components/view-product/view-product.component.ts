import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent {
  @Input() product: any; // Recibe el producto como entrada

  constructor(private modalController: ModalController) {}

  close() {
    this.modalController.dismiss();
  }
}
