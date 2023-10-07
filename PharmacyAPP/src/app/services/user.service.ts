import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7148/api/User';

  constructor(private http: HttpClient) {}

  updateUserDetails(updatedUser: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const updateUrl = `${this.apiUrl}/users/${updatedUser.id}`;

    return this.http
      .put(updateUrl, updatedUser, httpOptions)
      .pipe(
        catchError((error) => {
          // Handle error and provide user feedback
          console.error('Error updating user details:', error);
          return throwError(error);
        })
      );
  }
}
