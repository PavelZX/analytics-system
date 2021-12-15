import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { MainSocket } from '../../../core/socket/main-socket';
import { Channel } from '../../channel/service/channel.service';
import { Organization } from '../../organization/service/organization.service';

const { api } = environment;

export interface Advertising {
  _id: string;
  title: string;
  description: string;
  isActive: boolean;
  channels: Channel[] | string[];
  owner: Organization | string;
}

@Injectable({
  providedIn: 'root',
})
export class AdvertisingService {
  constructor(private socket: MainSocket, private http: HttpClient) {}

  getAdvertising(advertisingId: string) {
    return this.http.get<Advertising>(`${api}/advertising/id/${advertisingId}`);
  }

  getActiveAdvertisings() {
    return this.http.get<Advertising[]>(`${api}/advertising/active`);
  }

  getAdvertisings() {
    return this.http.get<Advertising[]>(`${api}/advertising/all`);
  }

  createAdvertising(advertising: Partial<Advertising>) {
    return this.http.post<Advertising>(`${api}/advertising`, advertising);
  }

  deleteAdvertising(advertising: Advertising) {
    return this.http.delete(`${api}/advertising/delete/${advertising._id}`);
  }

  updateAdvertising(id: string, advertising: Advertising) {
    return this.http.put<Advertising>(`${api}/advertising/${id}`, advertising);
  }
}
