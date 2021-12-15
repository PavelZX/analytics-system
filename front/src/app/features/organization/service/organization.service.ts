import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { MainSocket } from '../../../core/socket/main-socket';
import { User } from '../../auth/service/auth.service';

const { api } = environment;

export interface Organization {
  _id: string;
  title: string;
  description: string;
  isActive: boolean;
  members: User[] | string[];
  balance: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  constructor(private socket: MainSocket, private http: HttpClient) {}

  getOrganization(organizationId: string) {
    return this.http.get<Organization>(`${api}/organization/id/${organizationId}`);
  }

  getActiveOrganizations() {
    return this.http.get<Organization[]>(`${api}/organization/active`);
  }

  getOrganizations() {
    return this.http.get<Organization[]>(`${api}/organization/all`);
  }

  createOrganization(organization: Partial<Organization>) {
    return this.http.post<Organization>(`${api}/organization`, organization);
  }

  deleteOrganization(organization: Organization) {
    return this.http.delete(`${api}/organization/delete/${organization._id}`);
  }

  updateOrganization(id: string, organization: Organization) {
    return this.http.put<Organization>(`${api}/organization/${id}`, organization);
  }
}
