import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PushService } from './services/push.service';
import { PushNotification, PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private pushService: PushService
  ) {
    
    this.platform.ready().then(() => {
      this.pushService.OneSignalInit();

      PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
        console.log('Push received: ', JSON.stringify(notification));
      });

    });
  }

  
}
