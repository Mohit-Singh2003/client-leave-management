import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LeaveService } from '../../services/leave.service';
import { Leave } from '../../models/user.model';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manager-dashboard',
  template: `
    <nav class="navbar navbar-dark" style="background-color: var(--manager-nav-bg)">
      <div class="container-fluid">
        <button class="btn btn-outline-light" (click)="logout()">Logout</button>
        <span class="navbar-text">Welcome, {{ username }}</span>
      </div>
    </nav>

    <div class="container mt-4">
      <h2 class="mb-4">Leave Requests</h2>

      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Leave ID</th>
              <th>Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let leave of leaves">
              <td>{{ leave.employeeId }}</td>
              <td>{{ leave.id.substring(0, 8) }}</td>
              <td>{{ leave.type }}</td>
              <td>{{ leave.startDate | date: 'shortDate' }}</td>
              <td>{{ leave.endDate | date: 'shortDate' }}</td>
              <td>{{ leave.reason }}</td>
              <td>
                <span [ngClass]="'status-' + leave.status.toLowerCase()">
                  <i class="fas" [ngClass]="{
                    'fa-clock': leave.status === 'Pending',
                    'fa-check': leave.status === 'Approved',
                    'fa-times': leave.status === 'Rejected'
                  }"></i>
                  {{ leave.status }}
                </span>
              </td>
              <td>
                <div *ngIf="leave.status === 'Pending'" class="btn-group">
                  <button
                    class="btn btn-sm btn-success"
                    (click)="updateStatus(leave.id, 'Approved')">
                    Approve
                  </button>
                  <button
                    class="btn btn-sm btn-danger"
                    (click)="updateStatus(leave.id, 'Rejected')">
                    Reject
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="leaves.length === 0">
              <td colspan="8" class="text-center">No leave requests found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe]
})
export class ManagerDashboardComponent implements OnInit, OnDestroy {
  username = '';
  leaves: Leave[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private leaveService: LeaveService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.username = user.username;

      // Subscribe to the leaves$ observable to get real-time updates
      this.subscription = this.leaveService.leaves$.subscribe(allLeaves => {
        this.leaves = allLeaves
          .filter(leave => leave.isActive)
          .map(leave => ({
            ...leave,
            startDate: (leave.startDate as any).toDate ? (leave.startDate as any).toDate() : leave.startDate,
            endDate: (leave.endDate as any).toDate ? (leave.endDate as any).toDate() : leave.endDate
          }));
      });
    } else {
      // Redirect to login if no user is found
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy() {
    // Clean up the subscription when component is destroyed
    this.subscription.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  updateStatus(leaveId: string, status: 'Approved' | 'Rejected') {
    this.leaveService.updateLeaveStatus(leaveId, status);
alert(`Leave ${status.toLowerCase()} successfully`);}
}
