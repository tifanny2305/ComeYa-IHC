import { Injectable } from '@angular/core';
// Importamos el objeto global de la WebApp de Telegram
import WebApp from '@twa-dev/sdk'; 

@Injectable({
  providedIn: 'root'
})
export class TelegramService {
  
  private tg = WebApp;

  constructor() {
    // Avisamos a Telegram que la app ya cargó
    this.tg.ready();
    this.tg.expand();
  }

  // Getter para obtener los datos del usuario (Nombre, ID, Username)
  get user() {
    return this.tg.initDataUnsafe?.user;
  }

  // Función para cerrar la Mini App
  sendData(data: any) {
    this.tg.sendData(JSON.stringify(data));
  }

  close() {
    this.tg.close();
  }
}