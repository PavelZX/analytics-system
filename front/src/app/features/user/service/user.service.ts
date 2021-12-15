import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { User } from '../../auth/service/auth.service';

const { api } = environment;

export interface UpdatePasswordBody {
  currentPassword?: string;
  password?: string;
  confirmPassword?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUser(firstName: string) {
    return this.http.get<User>(`${api}/user/${firstName}`);
  }

  getUserId(userId: string) {
    return this.http.get<User>(`${api}/user/id/${userId}`);
  }

  getPublicUsers() {
    return this.http.get<User[]>(`${api}/user/public`);
  }

  getUsersByMember() {
    return this.http.get<User[]>(`${api}/user/member`);
  }

  getUsers() {
    return this.http.get<User[]>(`${api}/user/all`);
  }

  createUser(user: Partial<User>) {
    return this.http.post<User>(`${api}/user`, user);
  }

  deleteUser(user: User) {
    return this.http.delete(`${api}/user/delete/${user._id}`);
  }

  updateUser(id: string, user: User) {
    return this.http.put<User>(`${api}/user/${id}`, user);
  }

  joinUser(userId: string) {
    return this.http.post<User>(`${api}/user/join`, { userId });
  }

  leaveUser(userId: string) {
    return this.http.delete<User>(`${api}/user/leave/${userId}`);
  }

  updateUsername(firstName: string) {
    return this.http.put(`${api}/settings/firstName`, { firstName });
  }

  updateMobileNumber(mobileNumber: string) {
    return this.http.put(`${api}/settings/mobileNumber`, { mobileNumber });
  }

  updateEmail(email: string) {
    return this.http.put(`${api}/settings/email`, { email });
  }

  updatePassword(data: UpdatePasswordBody) {
    return this.http.put(`${api}/settings/password`, data);
  }
}
