import { ProductCategory } from '../../_models/product-category-model';
import { Product } from '../../_models/product-model';
import { ProductCategoryService } from '../../_services/product-category-service';
import { ProductService } from './../../_services/product-service';
import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-main-product-component',
  standalone: false,
  templateUrl: './main-product-component.html',
  styleUrl: './main-product-component.css',
})
export class MainProductComponent {
  productList: Product[] = [];
  allProducts: Product[] = [];
  readonly serverUrl = 'https://localhost:7000';
  categoryList: ProductCategory[] = [];
  selectedCategoryId: number | null = null;

  constructor(
    private ProductService: ProductService,
    private CategoryService: ProductCategoryService,
    private cdr: ChangeDetectorRef
  ) {
    this.getAllProducts();
    this.getCategories();
  }

  getAllProducts() {
    this.ProductService.getAll().subscribe({
      next: values => {
        // Prepend server address to thumbnailImagePath if needed
        this.allProducts = values.map(product => ({
          ...product,
          thumbnailImagePath: this.getImageUrl(product.thumbnailImagePath)
        }));
        // Show only first 6 products
        this.productList = this.allProducts.slice(0, 6);
        this.cdr.detectChanges();
      }
    })
  }
  /**
   * Get full image URL by prepending server address
   */
  getImageUrl(path: string | null | undefined): string {
    if (!path) return 'assets/img/portfolio/companyservices.png';
    if (path.startsWith('http') || path.startsWith('data:')) {
      return path;
    }
    return `${this.serverUrl}${path}`;
  }

  getCategories() {
    this.CategoryService.getAll().subscribe({
      next: values => {
        // Only take first 4 categories
        this.categoryList = values.slice(0, 4);
        this.cdr.detectChanges();
      }
    })
  }

  filterByCategory(categoryId: number | null) {
    this.selectedCategoryId = categoryId;
    if (categoryId === null) {
      this.productList = this.allProducts;
    } else {
      this.productList = this.allProducts.filter(p => p.categoryId === categoryId);
    }
    this.cdr.detectChanges();
  }
}
