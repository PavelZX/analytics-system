import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { MainSocket } from '../../../core/socket/main-socket';

const { api } = environment;

export interface Channel {
  _id: string;
  title: string;
  description: string;
  isActive: boolean;
  balance: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  constructor(private socket: MainSocket, private http: HttpClient) {}

  getChannel(channelId: string) {
    return this.http.get<Channel>(`${api}/channel/id/${channelId}`);
  }

  getActiveChannels() {
    return this.http.get<Channel[]>(`${api}/channel/active`);
  }

  getChannels() {
    return this.http.get<Channel[]>(`${api}/channel/all`);
  }

  createChannel(channel: Partial<Channel>) {
    return this.http.post<Channel>(`${api}/channel`, channel);
  }

  deleteChannel(channel: Channel) {
    return this.http.delete(`${api}/channel/delete/${channel._id}`);
  }

  updateChannel(id: string, channel: Channel) {
    return this.http.put<Channel>(`${api}/channel/${id}`, channel);
  }
}
