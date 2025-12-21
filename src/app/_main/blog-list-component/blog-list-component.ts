import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BlogService } from '../../_services/blog-service';
import { Blog } from '../../_models/blog-model';

@Component({
  selector: 'app-blog-list',
  standalone: false,
  templateUrl: './blog-list-component.html',
  styleUrl: './blog-list-component.css',
})
export class BlogListComponent implements OnInit {
  blogs: Blog[] = [];
  loading = true;
  error: string | null = null;
  readonly serverUrl = 'https://localhost:7000';

  constructor(private blogService: BlogService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.blogService.getWithDetails().subscribe({
      next: (data) => {
        this.blogs = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load blogs.';
        this.loading = false;
        this.cdr.detectChanges();
      }
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
