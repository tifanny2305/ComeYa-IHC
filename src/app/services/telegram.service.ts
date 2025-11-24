import { Injectable } from '@angular/core';
// Importamos el objeto global de la WebApp de Telegram
import WebApp from '@twa-dev/sdk'; 

@Injectable({
  providedIn: 'root'
})
export class TelegramService {
  
  // Guardamos la referencia a la API de Telegram
  private tg = WebApp;

  constructor() {
    // Avisamos a Telegram que la app ya cargó
    this.tg.ready();
    // Opcional: Expandir la app para que ocupe toda la altura
    this.tg.expand();
  }

  // 1. Getter para obtener los datos del usuario (Nombre, ID, Username)
  get user() {
    return this.tg.initDataUnsafe?.user;
  }

  // 2. Función para cerrar la Mini App y mandar datos al Bot
  sendData(data: any) {
    // Telegram solo acepta strings, así que convertimos el JSON a texto
    this.tg.sendData(JSON.stringify(data));
  }

  // Extra: Función para cerrar la app sin mandar datos
  close() {
    this.tg.close();
  }
}