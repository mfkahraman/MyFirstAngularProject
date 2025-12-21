import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'testimonialSearch',
  standalone: true
})
export class TestimonialSearchPipe implements PipeTransform {
  transform(testimonials: any[], searchTerm: string): any[] {
    if (!testimonials || !searchTerm) return testimonials;
    const term = searchTerm.toLowerCase();
    return testimonials.filter(t =>
      (t.clientName && t.clientName.toLowerCase().includes(term)) ||
      (t.title && t.title.toLowerCase().includes(term)) ||
      (t.comment && t.comment.toLowerCase().includes(term))
    );
  }
}
