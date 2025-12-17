import { Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout implements AfterViewInit {
  constructor(
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngAfterViewInit() {
    // Modern sidebar toggle functionality
    const sidebarCollapseBtn = this.el.nativeElement.querySelector('#sidebarCollapse');
    const sidebarToggleMobile = this.el.nativeElement.querySelector('#sidebarToggleMobile');
    const sidebar = this.el.nativeElement.querySelector('#sidebar');

    // Desktop sidebar collapse
    if (sidebarCollapseBtn && sidebar) {
      this.renderer.listen(sidebarCollapseBtn, 'click', () => {
        sidebar.classList.toggle('collapsed');
      });
    }

    // Mobile sidebar toggle
    if (sidebarToggleMobile && sidebar) {
      this.renderer.listen(sidebarToggleMobile, 'click', () => {
        sidebar.classList.toggle('active');
      });
    }

    // Close sidebar on mobile when clicking outside
    if (window.innerWidth <= 1024) {
      this.renderer.listen('document', 'click', (event: Event) => {
        const target = event.target as HTMLElement;
        if (sidebar && !sidebar.contains(target) && !sidebarToggleMobile?.contains(target)) {
          this.renderer.removeClass(sidebar, 'active');
        }
      });
    }

    // Update active nav link based on current route
    this.updateActiveNavLink();

    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveNavLink();
        // Close mobile sidebar on navigation
        if (window.innerWidth <= 1024 && sidebar) {
          this.renderer.removeClass(sidebar, 'active');
        }
      });
  }

  private updateActiveNavLink() {
    const navLinks = this.el.nativeElement.querySelectorAll('.nav-link');
    const currentPath = this.router.url;

    navLinks.forEach((link: HTMLElement) => {
      const href = link.getAttribute('href');
      if (href && currentPath.startsWith(href) && href !== '#') {
        this.renderer.addClass(link, 'active');
      } else {
        this.renderer.removeClass(link, 'active');
      }
    });
  }
}
