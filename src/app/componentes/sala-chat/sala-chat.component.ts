import { Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-sala-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './sala-chat.component.html',
  styleUrls: ['./sala-chat.component.scss']
})
export class SalaChatComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  messageText: string = '';
  username: string = '';
  private messageChannel: any;

  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;

  constructor(
    private supabase: AuthService,
    private router: Router,
     private zone: NgZone
  ) {}

  async ngOnInit() {
    this.username = await this.supabase.getSessionUser();
    this.loadMessages();
    this.setupRealtimeSubscription();
    this.scrollToBottom();
  }

  ngOnDestroy() {
    if (this.messageChannel) {
      this.messageChannel.unsubscribe();
    }
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
        this.messages = [...this.messages, payload.new];
        this.scrollToBottom();
      });
    }
  )
  .subscribe(status => {
    if (status === 'SUBSCRIBED') {
      console.log('Suscripción a mensajes activa');
    }
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

     this.loadMessages();

    if (error) {
      console.error('Error enviando mensaje:', error);
      alert('Hubo un error al enviar el mensaje.');
      return;
    }
    this.messageText = '';
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainer?.nativeElement) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  logout() {
    this.supabase.logout()
      .then(() => this.router.navigate(['/login']))
      .catch(err => console.error('Error al cerrar sesión:', err));
  }

  backHome(){
    this.router.navigate(['/home'])
  }

}
