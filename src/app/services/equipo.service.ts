// src/app/services/equipo.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UUID } from 'crypto';

// Interface que define o formato dos dados retornados pela sua API,
// para garantir a tipagem correta.
export interface EquipamentoMontagemDto {
  idEquipamentoMontagem: string; // Ou Guid, se for o caso
  idEquipamento: string;
  nomeEquipamento: string;
  dataLancamento: Date;
  dataFechamentoCorte: Date;
  dataFechamentoSolda: Date;
  dataFechamentoPintura: Date;
  dataFechamentoMontagem: Date;
  status: number;
  etapa: number;
}

interface CriaEquipamentoMontagemCommand {
  IdEquipamento: string;
}

// Novas interfaces para os dados dos dropdowns
export interface EquipamentoDto {
  idEquipamento: string;
  nomeEquipamento: string;
}

export interface SetorDto {
  idSetor: string;
  nomeSetor: string;
}

@Injectable({
  providedIn: 'root'
})
export class EquipoService {
  private apiUrl = 'https://localhost:7084'; // Substitua pelo URL da sua API

  constructor(private http: HttpClient) { }

  /**
   * Obtém a lista de equipamentos de montagem da API.
   * Retorna um Observable de uma lista de EquipamentoMontagemDto.
   */
  getEquipamentosMontagem(): Observable<EquipamentoMontagemDto[]> {
    return this.http.get<EquipamentoMontagemDto[]>(this.apiUrl + '/EquipamentosMontagem');
  }

  // MÉTODO CORRIGIDO
// MÉTODO CORRIGIDO
  salvarEquipamentoMontagem(idEquipamento: string): Observable<any> {
    // Cria o payload no formato de objeto que o backend espera.
    const payload: CriaEquipamentoMontagemCommand = {
      IdEquipamento: idEquipamento
    };

    // Agora o método envia o objeto 'payload' no corpo da requisição POST.
    // O URL da rota de criação no backend deve estar correto.
    return this.http.post<EquipamentoMontagemDto>(`${this.apiUrl}/EquipamentosMontagem`, payload);
  }

  processaEtapa(idEquipamentoMontagem: string, novaEtapa: number): Observable<any> {
    const payload = {
      IdEquipamentoMontagem: idEquipamentoMontagem,
      EtapaAtual: novaEtapa,
      DataAtualizacao: new Date().toISOString()
    };
    return this.http.put(`${this.apiUrl}/ProcessaEtapa`, payload); // Assuming a PUT endpoint for processing stage
  }
}

