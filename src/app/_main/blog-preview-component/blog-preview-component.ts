import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Blog } from '../../_models/blog-model';
import { BlogService } from '../../_services/blog-service';

@Component({
  selector: 'app-blog-preview',
  standalone: false,
  templateUrl: './blog-preview-component.html',
  styleUrl: './blog-preview-component.css',
})
export class BlogPreviewComponent implements OnInit {
  blogList: Blog[] = [];
  readonly serverUrl = 'https://localhost:7000';

  constructor(
    private blogService: BlogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadRecentBlogs();
  }

  loadRecentBlogs() {
    this.blogService.getWithDetails().subscribe({
      next: (blogs) => {
        // Prepend server address to blog and writer images
        this.blogList = blogs.slice(0, 6).map(blog => ({
          ...blog,
          coverImageUrl: this.getImageUrl(blog.coverImageUrl),
          writer: blog.writer ? {
            ...blog.writer,
            imageUrl: this.getImageUrl(blog.writer.imageUrl)
          } : null
        }));
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading blogs:', error),
    });
  }

  getImageUrl(path: string | null | undefined): string {
    if (!path) return 'assets/img/portfolio/companyservices.png';
    if (path.startsWith('http') || path.startsWith('data:')) {
      return path;
    }
    return `${this.serverUrl}${path}`;
  }
}
