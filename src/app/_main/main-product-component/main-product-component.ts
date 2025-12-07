import { Product } from '../../_models/product';
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
  /**
   *
   */
  constructor(private ProductService: ProductService) {
    this.getAllProducts();
  }

  getAllProducts() {
    this.ProductService.getAll().subscribe({
      next: values => this.productList = values
    })
  }
}
