import { Component } from '@angular/core';
import { Category } from '../../_models/category';
import { CategoryService } from '../../_services/categoryService';

@Component({
  selector: 'app-categoryComponent',
  standalone: false,
  templateUrl: './categoryComponent.html',
  styleUrl: './categoryComponent.css',
})
export class CategoryComponent
{
  categoryList: Category[];

  constructor(private categoryService: CategoryService){
    this.getAll(); //in order to getAllmethod to work initially
  }

  getAll(){
    this.categoryService.getAll().subscribe({
      next: values => this.categoryList = values,
      error: err=> console.log(err)
    })}
}
