import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Testimonial } from '../../_models/testimonial-model';
import { TestimonialService } from '../../_services/testimonial-service';

@Component({
  selector: 'app-testimonial-component',
  standalone: false,
  templateUrl: './main-testimonial-component.html',
  styleUrl: './main-testimonial-component.css',
})
export class MainTestimonialComponent implements OnInit {
  testimonials: Testimonial[] = [];
  isLoading = true;
  readonly serverUrl = 'https://localhost:7000';

  constructor(
    private testimonialService: TestimonialService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchTestimonials();
  }

  fetchTestimonials() {
    this.isLoading = true;
    this.testimonialService.getAll().subscribe({
      next: (data) => {
        this.testimonials = (data || []).map(t => ({
          ...t,
          imageUrl: this.getImageUrl(t.imageUrl)
        }));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error('Error loading testimonials:', err);
      }
    });
  }

  getImageUrl(path: string | null | undefined): string {
    if (!path) return 'https://ui-avatars.com/api/?name=Client&size=400&background=random';
    if (path.startsWith('http') || path.startsWith('data:')) {
      return path;
    }
    return `${this.serverUrl}${path}`;
  }

  onImageError(testimonial: any) {
    testimonial.imageUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(testimonial.clientName || 'Client') + '&size=400&background=random';
  }
}
