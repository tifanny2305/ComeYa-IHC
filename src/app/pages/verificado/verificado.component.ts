import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TelegramService } from '../../services/telegram.service';

@Component({
  selector: 'app-verificado',
  standalone: true,
  // Sin RouterModule aquí, el botón es solo un adorno y no navega
  imports: [CommonModule, RouterModule], 
  templateUrl: './verificado.component.html',
  styleUrls: ['./verificado.component.scss']
})
export class VerificadoComponent implements OnInit {
  private telegramService = inject(TelegramService);

  ngOnInit() {
    // Si necesitas mandar una confirmación final al bot antes de cerrar:
    // this.telegramService.sendData({ status: 'finalizado', success: true });
    
    // Si quieres que el usuario vea el mensaje por unos segundos, usa un temporizador:
    setTimeout(() => {
      this.telegramService.close(); // Cierra la Mini App de Telegram
    }, 5000); // Cierra después de 5 segundos
  }

  // Nuevo método para cerrar si el usuario hace clic en un botón "Finalizar"
  finalizar() {
    this.telegramService.close();
  }
}