import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  recentBlogs: Blog[] = [];
  readonly serverUrl = 'https://localhost:7000';

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.blogId = +params['id'];
      this.loadBlog();
    });
    this.loadRecentBlogs();
  }

  loadBlog() {
    this.blogService.getWithDetailsById(this.blogId).subscribe({
      next: (blog) => {
        this.blog = blog;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.blog = null;
        this.cdr.detectChanges();
      },
    });
  }

  loadRecentBlogs() {
    this.blogService.getWithDetails().subscribe({
      next: (blogs) => {
        // Exclude the current blog and take the 5 most recent
        this.recentBlogs = blogs
          .filter(b => b.id !== this.blogId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        this.cdr.detectChanges();
      },
      error: () => {
        this.recentBlogs = [];
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
