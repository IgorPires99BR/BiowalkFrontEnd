// src/app/login/login.component.ts

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  login: string = '';
  password: string = '';
  
  constructor(
    private router: Router, 
    private http: HttpClient, 
    private userService: UserService
  ) { }

  onSubmit() {
    const apiUrl = 'https://localhost:7084/Usuario'; 
    const loginCommand = {
      loginUsuario: this.login,
      senhaUsuario: this.password
    };

    this.http.post<{ idSetor: string }>(apiUrl, loginCommand) 
      .pipe(
        tap(response => {
          if (response && response.idSetor) {
            this.userService.setUserSector(response.idSetor.toUpperCase());
          }
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Login bem-sucedido! Navegando para a Home.');
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Erro na requisição de login:', error);
          alert('Credenciais inválidas. Por favor, tente novamente.');
        }
      });
  }
}