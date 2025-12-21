import { Pipe, PipeTransform } from '@angular/core';
import { Blog } from '../../_models/blog-model';

@Pipe({
  name: 'blogSearch',
  standalone: true
})
export class BlogSearchPipe implements PipeTransform {
  transform(blogs: Blog[], searchTerm: string): Blog[] {
    if (!blogs || !searchTerm) return blogs;
    const term = searchTerm.toLowerCase();
    return blogs.filter(blog =>
      (blog.title && blog.title.toLowerCase().includes(term)) ||
      (blog.content && blog.content.toLowerCase().includes(term)) ||
      (blog.writer?.fullName && blog.writer.fullName.toLowerCase().includes(term)) ||
      (blog.category?.name && blog.category.name.toLowerCase().includes(term))
    );
  }
}
