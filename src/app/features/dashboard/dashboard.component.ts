import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { TicketService } from '../../core/services/ticket.service';
import { Ticket, TicketStatus, TicketPriority } from '../../core/models/ticket.interface';

interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  highPriority: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private ticketService = inject(TicketService);

  stats: TicketStats = {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    highPriority: 0
  };

  recentTickets: Ticket[] = [];
  displayedColumns: string[] = ['title', 'status', 'priority', 'createdAt'];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.ticketService.getTickets().subscribe(tickets => {
      this.calculateStats(tickets);
      this.recentTickets = this.getRecentTickets(tickets);
    });
  }

  private calculateStats(tickets: Ticket[]): void {
    this.stats = {
      total: tickets.length,
      open: tickets.filter(t => t.status === TicketStatus.OPEN).length,
      inProgress: tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length,
      resolved: tickets.filter(t => t.status === TicketStatus.RESOLVED).length,
      closed: tickets.filter(t => t.status === TicketStatus.CLOSED).length,
      highPriority: tickets.filter(t => 
        t.priority === TicketPriority.HIGH || t.priority === TicketPriority.URGENT
      ).length
    };
  }

  private getRecentTickets(tickets: Ticket[]): Ticket[] {
    return tickets
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }

  getPriorityColor(priority: TicketPriority): string {
    switch (priority) {
      case TicketPriority.LOW: return 'green';
      case TicketPriority.MEDIUM: return 'orange';
      case TicketPriority.HIGH: return 'red';
      case TicketPriority.URGENT: return 'purple';
      default: return 'gray';
    }
  }

  getStatusColor(status: TicketStatus): string {
    switch (status) {
      case TicketStatus.OPEN: return 'blue';
      case TicketStatus.IN_PROGRESS: return 'orange';
      case TicketStatus.ON_HOLD: return 'gray';
      case TicketStatus.RESOLVED: return 'green';
      case TicketStatus.CLOSED: return 'black';
      default: return 'gray';
    }
  }
}