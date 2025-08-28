// src/app/services/user.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Adiciona uma propriedade privada para armazenar o GUID do setor do usuário
  private userSectorGuid: string | null = null;

  // Adiciona um mapeamento de GUIDs para nomes de setor.
  // Este mapeamento deve corresponder aos dados reais do seu backend.
  // Exemplo de dados:
  private sectorMapping: { [key: string]: string } = {
    'E8D94A48-42F3-40CB-8670-AAC95A93145F': 'Corte',
    '5ED680C2-91CF-4C3E-9E39-4C6E2E614B6D': 'Solda',
    '1F0F21B2-436A-4ABF-920D-268344BEF919': 'Pintura',
    '183E5A49-C651-4BA9-92E5-4A2F8BC18D58': 'Montagem',
    '325D91BC-322B-4CE6-A3BA-2EFDCB462CB9': 'Administrativo',
    'E4D1A0A0-E3B2-4A7B-9A8C-519A44B1D2B9': 'Finalizado'
  };

  constructor() { }

  // Método para definir o GUID do setor do usuário.
  setUserSector(guid: string): void {
    this.userSectorGuid = guid;
  }

  // Método para obter o NOME do setor do usuário a partir do GUID.
  // Retorna null se o GUID não for encontrado no mapeamento.
  getUserSectorName(): string | null {
    if (this.userSectorGuid && this.sectorMapping[this.userSectorGuid]) {
      return this.sectorMapping[this.userSectorGuid];
    }
    return null;
  }
}
