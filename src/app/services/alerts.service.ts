import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

interface options {
  message: string;
  position: 'top'  | 'middle' | 'bottom' ;
  icon: string;
  duration: number,
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(
    private _toasCtrl: ToastController
  ) { }


  async generateToast( op: options ){
    const toast = await this._toasCtrl.create( {
      message : op.message,
      position : op.position,
      icon: op.icon,
      duration: op.duration,
      color: op.color
    });
    await toast.present();
  }

}
