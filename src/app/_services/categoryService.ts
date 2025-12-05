import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../_models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiUrl = 'https://localhost:7000/api/Categories/'
  constructor(private http: HttpClient){}

  getAll(){
    return this.http.get<Category[]>(this.apiUrl);
  }

  getById(id:number){
  return this.http.get<Category>(this.apiUrl+id);
  }

  create(model:Category){
    return this.http.post<Category>(this.apiUrl,model);
  }

  update(id:number,model:Category){
    return this.http.put(this.apiUrl+id,model);
  }

  delete(id:number){
    return this.http.delete(this.apiUrl+id);
  }
}
