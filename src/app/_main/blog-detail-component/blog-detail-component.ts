import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Blog } from '../../_models/blog-model';
import { BlogService } from '../../_services/blog-service';

@Component({
  selector: 'app-blog-detail',
  standalone: false,
  templateUrl: './blog-detail-component.html',
  styleUrl: './blog-detail-component.css',
})
export class BlogDetailComponent implements OnInit {
  blog: Blog | null = null;
  blogId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.blogId = +params['id'];
      this.loadBlog();
    });
  }

  loadBlog() {
    this.blogService.getById(this.blogId).subscribe({
      next: (blog) => {
        this.blog = blog;
      },
      error: (error) => console.error('Error loading blog:', error),
    });
  }
}
