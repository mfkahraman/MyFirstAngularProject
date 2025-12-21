import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../_services/product-service';
import { Product } from '../../_models/product-model';

@Component({
  selector: 'app-portfolio-details-component',
  standalone: false,
  templateUrl: './portfolio-details-component.html',
  styleUrl: './portfolio-details-component.css',
})
export class PortfolioDetailsComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error: string | null = null;
  readonly serverUrl = 'https://localhost:7000';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productService.getWithDetails().subscribe({
        next: (products) => {
          this.product = products.find((p: Product) => p.id == id) || null;
          if (!this.product) {
            this.error = 'Portfolio item not found.';
          }
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Failed to load portfolio details.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.error = 'Invalid portfolio ID.';
      this.loading = false;
      this.cdr.detectChanges();
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
