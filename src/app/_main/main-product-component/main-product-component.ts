import { ProductCategory } from '../../_models/product-category-model';
import { Product } from '../../_models/product-model';
import { ProductCategoryService } from '../../_services/product-category-service';
import { ProductService } from './../../_services/product-service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-main-product-component',
  standalone: false,
  templateUrl: './main-product-component.html',
  styleUrl: './main-product-component.css',
})
export class MainProductComponent {
  productList: Product[] = [];
  categoryList: ProductCategory[] = [];
  /**
   *
   */
  constructor(private ProductService: ProductService,
    private CategoryService: ProductCategoryService) {
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
