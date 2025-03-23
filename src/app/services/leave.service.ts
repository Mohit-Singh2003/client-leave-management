import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Leave } from '../models/user.model';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
//  import leave service in leave form and call the method addLeave() to add a new leave request...
export class LeaveService {
  private backendUrl = 'http://127.0.0.1:8000';

  private leavesSubject = new BehaviorSubject<Leave[]>([]);
  public leaves$ = this.leavesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Generates headers with Authorization and Content-Type
  private async getAuthHeaders(): Promise<HttpHeaders> {
    const token = await this.authService.getFirebaseToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Load all leaves for the user
  async loadLeaves(): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await firstValueFrom(this.http.get<Leave[]>(`${this.backendUrl}/leaves/`, { headers }));
      this.leavesSubject.next(response);
    } catch (err) {
      console.error('Error loading leaves:', err);
    }
  }

  // Add a new leave request
  async addLeave(leave: Omit<Leave, 'id' | 'status' | 'isActive'>): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      await firstValueFrom(this.http.post(`${this.backendUrl}/leaves/`, leave, { headers }));
      await this.loadLeaves();
    } catch (err) {
      console.error('Error while applying for leave:', err);
    }
  }

  // Manager approves or rejects leave
  async updateLeaveStatus(leaveId: string, status: 'Approved' | 'Rejected'): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const url = `${this.backendUrl}/leaves/${leaveId}/${status.toLowerCase()}`;
      await firstValueFrom(this.http.put(url, {}, { headers }));
      await this.loadLeaves();
    } catch (err) {
      console.error(`Error updating leave status to ${status}:`, err);
    }
  }

  // Optional cancel leave method (not implemented on backend)
  async cancelLeave(leaveId: string): Promise<void> {
    console.warn('Cancel leave feature not implemented on backend');
  }
}
