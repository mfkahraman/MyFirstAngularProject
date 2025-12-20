import { Component, OnInit } from '@angular/core';
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

  constructor(private blogService: BlogService) {}

  ngOnInit() {
    this.loadBlogs();
  }

  loadBlogs() {
    this.blogService.getAll().subscribe({
      next: (blogs) => {
        this.blogList = blogs;
      },
      error: (error) => console.error('Error loading blogs:', error),
    });
  }
}
