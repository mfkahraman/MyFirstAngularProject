import { Component } from '@angular/core';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category
{
  category:string = 'Kategoriler';

  categories:string[] = ['Kategori 1', 'Kategori 2', 'Kategori 3', 'Kategori 4', 'Kategori 5',]
}
