import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TelegramService } from '../../services/telegram.service';

@Component({
  selector: 'app-verificado',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './verificado.component.html',
  styleUrls: ['./verificado.component.scss']
})
export class VerificadoComponent implements OnInit {
  private telegramService = inject(TelegramService);

  ngOnInit() {

    setTimeout(() => {
      this.telegramService.close(); 
    }, 5000);
  }

  finalizar() {
    this.telegramService.close();
  }
}