import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  public username:any = null;
  isHome: boolean = true;

constructor(private supabase:AuthService, private router:Router){}

  async ngOnInit(){
    this.username = await this.supabase.getSessionUser();
    this.router.events.subscribe(() => {
      this.isHome = this.router.url === '/home';
    });
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
