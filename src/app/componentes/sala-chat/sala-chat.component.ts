import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sala-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './sala-chat.component.html',
  styleUrls: ['./sala-chat.component.scss']
})
export class SalaChatComponent implements OnInit, OnDestroy, AfterViewInit {
  messages: any[] = [];
  messageText: string = '';
  username: string = '';
  private messageChannel: any;

  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;

  constructor(
    private supabase: AuthService,
    private router: Router,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initChat();
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    if (this.messageChannel) {
      this.messageChannel.unsubscribe();
    }
  }

  private async initChat() {
    this.username = await this.supabase.getSessionUser();
    await this.loadMessages();
    this.setupRealtimeSubscription();
  }

  private async loadMessages() {
    const { data, error } = await this.supabase.client
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error cargando mensajes:', error);
      return;
    }

    this.messages = data ?? [];
    this.cdr.detectChanges();
    this.scrollToBottom();
  }

  private setupRealtimeSubscription() {
    this.messageChannel = this.supabase.client
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        payload => {
          this.zone.run(() => {
            this.messages.push(payload.new);
            this.cdr.detectChanges();
            this.scrollToBottom();
          });
        }
      )
      .subscribe(status => {
        if (status === 'SUBSCRIBED') console.log('Suscripción a mensajes activa');
      });
  }

  async sendMessage() {
    const trimmedMsg = this.messageText.trim();
    if (!trimmedMsg) return;

    if (trimmedMsg.length > 50) {
      alert('El mensaje no puede superar los 50 caracteres.');
      return;
    }

    const { error } = await this.supabase.client
      .from('messages')
      .insert({
        text: trimmedMsg,
        user_email: this.username,
      });

    if (error) {
      console.error('Error enviando mensaje:', error);
      alert('Hubo un error al enviar el mensaje.');
      return;
    }

    this.messageText = '';
  }

  private scrollToBottom() {
    if (!this.chatContainer) return;
    const container = this.chatContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  logout() {
    this.supabase.logout()
      .then(() => this.router.navigate(['/login']))
      .catch(err => console.error('Error al cerrar sesión:', err));
  }

  backHome() {
    this.router.navigate(['/home']);
  }
}
