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
  category: Category = new Category();
  editCategory: any = {};

  constructor(private categoryService: CategoryService) {
    this.categoryList = [];
    this.getAll();
  }

  getAll(){
    this.categoryService.getAll().subscribe({
      next: values => this.categoryList = values,
      error: err=> console.log(err)
    })}

    create(){
      this.categoryService.create(this.category).subscribe({
        next: value => this.categoryList.push(value),
        error: err => console.log(err)
      })
  }

  update() {
    this.categoryService.update(this.editCategory.id,this.editCategory).subscribe({
      next: () => this.getAll(),
      error: err => console.log(err)
    })
  }

  onSelected(model:Category){
    this.editCategory = model;
  }
}

