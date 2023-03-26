
import { ApplicationRef, Component } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { PushService } from '../services/push.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  mensajes: any = []; //Arreglo para guardar las notificaciones
  constructor(
    public pushService: PushService,
    private applicationRef: ApplicationRef
  ) {

  }

  ngOnInit() {

    this.pushService.pushListener.subscribe(noti => {
      this.mensajes.unshift(noti);
      this.applicationRef.tick();
    });
  }

  async ionViewWillEnter() {
    
    try {
      this.mensajes = await this.pushService.getMensajes();
    } catch (error) {
      console.log('error', error);
    }

  }

  async borrarMensajes() {
    await this.pushService.borrarMensajes();
    this.mensajes = [];
    console.log(this.mensajes);
  }

}
