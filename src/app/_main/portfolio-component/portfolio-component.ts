import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../../_services/product-service';
import { Product } from '../../_models/product-model';
import { ProductCategoryService } from '../../_services/product-category-service';
import { ProductCategory } from '../../_models/product-category-model';

@Component({
  selector: 'app-portfolio-component',
  standalone: false,
  templateUrl: './portfolio-component.html',
  styleUrl: './portfolio-component.css',
})
export class PortfolioComponent implements OnInit, AfterViewChecked {
  selectedCategoryId: number | null = null;
  filteredProducts: Product[] = [];
  private isotopeInitialized = false;
  private lastProductCount = 0;

    ngAfterViewChecked(): void {
      // Only re-init if product count changes and DOM is ready
      if (!this.loadingProducts && !this.loadingCategories) {
        const container = document.querySelector('.isotope-layout .isotope-container');
        const items = container ? container.querySelectorAll('.isotope-item') : [];
        if (container && items.length && items.length !== this.lastProductCount) {
          this.lastProductCount = items.length;
          this.initIsotope(container);
        }
      }
    }
  products: Product[] = [];
  categories: ProductCategory[] = [];
  loadingProducts = true;
  loadingCategories = true;
  error: string | null = null;
  readonly serverUrl = 'https://localhost:7000';

  constructor(
    private productService: ProductService,
    private categoryService: ProductCategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.productService.getWithDetails().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.loadingProducts = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load portfolio items.';
        this.loadingProducts = false;
        this.cdr.detectChanges();
      }
    });
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.loadingCategories = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load categories.';
        this.loadingCategories = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterByCategory(categoryId: number | null) {
    this.selectedCategoryId = categoryId;
    if (categoryId === null) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p => (p.categoryId === categoryId || p.category?.id === categoryId));
    }
    this.cdr.detectChanges();
  }

  private initIsotope(container: Element) {
    // @ts-ignore
    if (window && typeof (window as any).Isotope !== 'undefined' && typeof (window as any).imagesLoaded === 'function') {
      (window as any).imagesLoaded(container, function() {
        // @ts-ignore
        new (window as any).Isotope(container, {
          itemSelector: '.isotope-item',
          layoutMode: 'masonry',
          filter: '*',
          sortBy: 'original-order'
        });
      });
    }
  }

  getImageUrl(path: string | null | undefined): string {
    if (!path) return 'assets/img/portfolio/companyservices.png';
    if (path.startsWith('http') || path.startsWith('data:')) {
      return path;
    }
    return `${this.serverUrl}${path}`;
  }
}
