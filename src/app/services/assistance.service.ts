import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' })
  };

@Injectable()
export class AssistanceService {
    constructor(private http: HttpClient){}
    getServices(){
        // Go get services
        return this.http.get(`http://localhost:49567/api/service-types`);
    }
    postAssistance(request){
        return this.http.post(`http://localhost:49567/api/assistance-requests`, request, httpOptions);
    }
}