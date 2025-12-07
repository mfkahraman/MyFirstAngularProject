import { CategoryService } from './../../_services/categoryService';
import { Product } from '../../_models/product';
import { ProductService } from './../../_services/product-service';
import { Component } from '@angular/core';
import { Category } from '../../_models/category';

@Component({
  selector: 'app-main-product-component',
  standalone: false,
  templateUrl: './main-product-component.html',
  styleUrl: './main-product-component.css',
})
export class MainProductComponent {
  productList: Product[] = [];
  categoryList: Category[] = [];
  /**
   *
   */
  constructor(private ProductService: ProductService,
    private CategoryService: CategoryService) {
    this.getAllProducts();
    this.getCategories();
  }

  getAllProducts() {
    this.ProductService.getAll().subscribe({
      next: values => this.productList = values
    })
  }

  getCategories() {
    this.CategoryService.getAll().subscribe({
      next: values => this.categoryList = values
    })
  }



}
