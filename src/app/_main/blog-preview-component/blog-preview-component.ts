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

  constructor(
    private blogService: BlogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadRecentBlogs();
  }

  loadRecentBlogs() {
    this.blogService.getAll().subscribe({
      next: (blogs) => {
        // Get only the 6 most recent blogs
        this.blogList = blogs.slice(0, 6);
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading blogs:', error),
    });
  }
}
