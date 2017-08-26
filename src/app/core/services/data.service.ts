import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class DataService {
  constructor(private http: Http) { }

  postData(url, param): Observable<any> {
    return this.http.post(url, JSON.stringify(param), { headers: new Headers({ 'Content-Type': 'application/json' }) })
      .map(res => res.json());
  }

}
