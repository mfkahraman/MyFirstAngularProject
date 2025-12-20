import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Blog } from '../../_models/blog-model';
import { BlogService } from '../../_services/blog-service';

@Component({
  selector: 'app-blog-list',
  standalone: false,
  templateUrl: './blog-list-component.html',
  styleUrl: './blog-list-component.css',
})
export class BlogListComponent implements OnInit {
  blogList: Blog[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 3;

  constructor(
    private blogService: BlogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadBlogs();
  }

  loadBlogs() {
    this.blogService.getWithDetails().subscribe({
      next: (blogs) => {
        this.blogList = blogs;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading blogs:', error),
    });
  }
}
