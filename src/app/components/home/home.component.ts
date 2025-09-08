// src/app/home/home.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { EquipoService, EquipamentoMontagemDto } from '../../services/equipo.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

export interface EquipamentoDto {
  idEquipamento: string;
  nomeEquipamento: string;
}

export interface SetorDto {
  idSetor: string;
  nomeSetor: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  tasksCorte: EquipamentoMontagemDto[] = [];
  tasksSolda: EquipamentoMontagemDto[] = [];
  tasksPintura: EquipamentoMontagemDto[] = [];
  tasksMontagem: EquipamentoMontagemDto[] = [];
  tasksFinalizado: EquipamentoMontagemDto[] = [];
  public showFinalizadoBoard: boolean = true;

  showModal = false;
  selectedTask: EquipamentoMontagemDto | null = null;

  showCreateModal = false;
  equipamentos: EquipamentoDto[] = [
    { idEquipamento: 'BC495898-67F0-40F6-B80B-067DF1EF8918', nomeEquipamento: 'Esteira Biowalk V2' },
    { idEquipamento: 'B41EA000-385E-4086-8B2B-2362D231659B', nomeEquipamento: 'Bicicleta Ergonomica Biowalk' },
    { idEquipamento: 'DFBCA3F5-8070-43D4-BBF0-6E4401FA52E6', nomeEquipamento: 'Escada' },
  ];
  selectedEquipamentoId: string | null = null;
  
  currentUserSector: string | null = null;

  constructor(
    private equipoService: EquipoService, 
    private router: Router, 
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.currentUserSector = this.userService.getUserSectorName();
    this.loadTasks();
  }
  
  loadTasks(): void {
    this.equipoService.getEquipamentosMontagem().subscribe(
      (data: EquipamentoMontagemDto[]) => {
        this.tasksCorte = data.filter((task: EquipamentoMontagemDto) => task.etapa === 1);
        this.tasksSolda = data.filter((task: EquipamentoMontagemDto) => task.etapa === 2);
        this.tasksPintura = data.filter((task: EquipamentoMontagemDto) => task.etapa === 3);
        this.tasksMontagem = data.filter((task: EquipamentoMontagemDto) => task.etapa === 4);
        this.tasksFinalizado = data.filter((task: EquipamentoMontagemDto) => task.etapa === 5);
      },
      error => {
        console.error('Error loading tasks:', error);
        alert('Erro ao carregar equipamentos. Por favor, tente novamente.');
      }
    );
  }

  private getNextSector(currentSector: string | null): string | null {
    switch (currentSector) {
      case 'Corte':
        return 'Solda';
      case 'Solda':
        return 'Pintura';
      case 'Pintura':
        return 'Montagem';
      case 'Montagem':
        return 'Finalizado';
      default:
        return null;
    }
  }

toggleFinalizadoBoard(event: any) {
  // A propriedade 'checked' do evento de input indica se o checkbox está marcado.
  // Se estiver 'true' (marcado), 'showFinalizadoBoard' se torna 'false' (oculta o board).
  // Se estiver 'false' (desmarcado), 'showFinalizadoBoard' se torna 'true' (exibe o board).
  this.showFinalizadoBoard = !event.target.checked;
}

  // Lógica de verificação para exibir o setor do usuário, o próximo setor, E todos os boards para 'Administrativo'
  isSector(sectorName: string): boolean {
    // 1. Se o usuário for 'Administrativo', retorne true para qualquer board.
    if (this.currentUserSector === 'Administrativo') {
      return true;
    }
    
    // 2. Para os demais usuários, use a lógica de exibir o setor atual e o próximo.
    const nextSector = this.getNextSector(this.currentUserSector);
    const isCurrentSector = this.currentUserSector === sectorName;
    const isNextSector = nextSector === sectorName;

    return isCurrentSector || isNextSector;
  }

  openModal(task: EquipamentoMontagemDto) {
    this.selectedTask = task;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedTask = null;
  }

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.selectedEquipamentoId = null;
  }

  calculateDurationInMinutes(startDate: Date | null, endDate: Date | null): string {
    if (!startDate || !endDate) {
      return 'Não-Registrado';
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const differenceInMs = end.getTime() - start.getTime();
    const minutes = Math.floor(differenceInMs / 60000);

    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}min`;
    }
  }

  async adicionarEquipamento(): Promise<void> {
    if (this.selectedEquipamentoId) {
      const nomeEquipamento = this.equipamentos.find(e => e.idEquipamento === this.selectedEquipamentoId)?.nomeEquipamento;

      if (!nomeEquipamento) {
        console.error('Nome do equipamento não encontrado!');
        return;
      }

      try {
        const response: EquipamentoMontagemDto = await this.equipoService.salvarEquipamentoMontagem(this.selectedEquipamentoId).toPromise();

        this.closeCreateModal();
        alert(`Nova montagem adicionada com sucesso!`);
        this.loadTasks();

      } catch (error) {
        console.error('Erro ao adicionar nova montagem:', error);
        alert('Erro ao adicionar nova montagem. Por favor, tente novamente.');
      }
    } else {
      alert('Por favor, selecione um equipamento.');
    }
  }

  async drop(event: CdkDragDrop<EquipamentoMontagemDto[]>) {
    const previousContainerId = event.previousContainer.id;
    const currentContainerId = event.container.id;

    const droppedTask = event.previousContainer.data[event.previousIndex];

    const stageMap: { [key: string]: number } = {
      corteList: 1,
      soldaList: 2,
      pinturaList: 3,
      montagemList: 4,
      finalizadoList: 5,
    };

    const previousEtapa = droppedTask.etapa;
    const newEtapa = stageMap[currentContainerId];

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    if (newEtapa < previousEtapa) {
      alert('Não é permitido mover um equipamento para uma etapa anterior!');
      return;
    }

    if (newEtapa > previousEtapa + 1) {
      alert('Não é permitido pular etapas! Mova apenas para a próxima etapa.');
      return;
    }

    if (newEtapa === previousEtapa + 1) {
      try {
        await this.equipoService.processaEtapa(droppedTask.idEquipamentoMontagem, previousEtapa).toPromise();

        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );

        droppedTask.etapa = newEtapa;

        alert(`Equipamento "${droppedTask.nomeEquipamento}" movido para a etapa de ${this.getEtapaName(newEtapa)} com sucesso!`);
        this.loadTasks();
      } catch (error) {
        console.error('Erro ao processar etapa:', error);
        alert('Erro ao atualizar a etapa do equipamento. Por favor, tente novamente.');
      }
    }
  }

  getEtapaName(etapa: number): string {
    switch (etapa) {
      case 1: return 'Corte';
      case 2: return 'Solda';
      case 3: return 'Pintura';
      case 4: return 'Montagem';
      case 5: return 'Finalizado';
      default: return 'Desconhecida';
    }
  }

  logout() {
    console.log('Saindo...');
    this.router.navigate(['/login']);
  }
}