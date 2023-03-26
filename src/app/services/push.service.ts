import { EventEmitter, Injectable } from '@angular/core';
import { OSNotification, OSNotificationPayload } from '@awesome-cordova-plugins/onesignal/ngx';
import OneSignal from 'onesignal-cordova-plugin';
import { OSNotificacion } from '../inteface/interface';
import { Storage } from '@ionic/storage-angular';
import { AlertController, Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PushService {
  mensajes: any[] = [];
  pushListener = new EventEmitter<OSNotificacion>(); //OSNot.. es una interface propia

 
  private _storage: Storage | null = null;



  constructor(
    //private oneSignal: OneSignal ,
    private storage: Storage,
    private platform: Platform,
    private alertCtrl: AlertController
  ) {

    this.init();
    this.cargarMensajes();

  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  OneSignalInit() {
    OneSignal.setAppId("8485580d-9be0-4b23-b4cf-0798f27e07e4");

    OneSignal.setNotificationWillShowInForegroundHandler(resp => {
      let notif = resp.getNotification();
      this.notificacionRecibida(resp.getNotification());
      // You can decide to display the notification or not
      resp.complete();
    });


    OneSignal.setNotificationOpenedHandler(jsonData => {
      this.notificacionRecibida(jsonData.notification);
    });

    //  Obtener ID del suscriptor
    

    // this.oneSignal.getIds().then(info => {
    //   this.userId = info.userId || 'bb4c4088-3427-44ff-8380-570aa6c1ce1a';
    //   console.log(this.userId);
    // });

    // this.oneSignal.endInit();
  }

  async notificacionRecibida(noti: any | OSNotification) {
    await this.cargarMensajes();
    //=)=============================================
    const existePush = this.mensajes.find(mensaje => { mensaje.notificationId === noti.notificationId });

    if (existePush) {
      return;
    }
    //===============================================
    if (this.mensajes.unshift(noti)) {
      
      try {
        this.pushListener.emit(noti);
      } catch (error) {
        console.error('Ocurrio un error', error);
      }
      await this.guardarMensajes();
    }

  }

  async getUserIdOneSignal() {
    // console.log('Cargando userId');
    // // Obtener ID del suscriptor
    // const info = await this.oneSignal.getIds();
    // this.userId = info.userId;
    // return info.userId;
  }



  async getMensajes() {

    await this.cargarMensajes();
    return [...this.mensajes];
  }

  async guardarMensajes() {
    this._storage?.set('mensajes', this.mensajes);
  }

  async cargarMensajes() {
    this.mensajes = await this._storage?.get('mensajes') || [];
    return this.mensajes;
  }

  async borrarMensajes() {
    await this._storage?.clear();
    this.mensajes = [];
    
  }

}