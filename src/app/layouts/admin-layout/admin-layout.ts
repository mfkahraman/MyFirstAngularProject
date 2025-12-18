import { Component, AfterViewInit, Renderer2, ElementRef, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

/**
 * Admin Layout Component
 * Provides the main layout structure for the admin dashboard
 * Includes sidebar navigation, header, and content area
 */
@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout implements AfterViewInit, OnDestroy {
  private routerSubscription?: Subscription;
  private readonly MOBILE_BREAKPOINT = 1024;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngAfterViewInit(): void {
    this.initializeSidebar();
    this.initializeRouteHandling();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.routerSubscription?.unsubscribe();
  }

  /**
   * Initialize sidebar functionality including toggle buttons and responsive behavior
   */
  private initializeSidebar(): void {
    const sidebarCollapseBtn = this.el.nativeElement.querySelector('#sidebarCollapse');
    const sidebarToggleMobile = this.el.nativeElement.querySelector('#sidebarToggleMobile');
    const sidebar = this.el.nativeElement.querySelector('#sidebar');

    if (!sidebar) return;

    // Desktop sidebar collapse functionality
    if (sidebarCollapseBtn) {
      this.renderer.listen(sidebarCollapseBtn, 'click', () => {
        sidebar.classList.toggle('collapsed');
      });
    }

    // Mobile sidebar toggle functionality
    if (sidebarToggleMobile) {
      this.renderer.listen(sidebarToggleMobile, 'click', () => {
        sidebar.classList.toggle('active');
      });
    }

    // Close sidebar when clicking outside on mobile devices
    if (this.isMobileView()) {
      this.renderer.listen('document', 'click', (event: Event) => {
        const target = event.target as HTMLElement;
        if (sidebar && !sidebar.contains(target) && !sidebarToggleMobile?.contains(target)) {
          this.renderer.removeClass(sidebar, 'active');
        }
      });
    }
  }

  /**
   * Initialize route change handling and active link highlighting
   */
  private initializeRouteHandling(): void {
    const sidebar = this.el.nativeElement.querySelector('#sidebar');

    // Set initial active link
    this.updateActiveNavLink();

    // Listen to route changes
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveNavLink();

        // Automatically close mobile sidebar after navigation
        if (this.isMobileView() && sidebar) {
          this.renderer.removeClass(sidebar, 'active');
        }
      });
  }

  /**
   * Update the active navigation link based on current route
   */
  private updateActiveNavLink(): void {
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

  /**
   * Check if the current view is mobile based on viewport width
   */
  private isMobileView(): boolean {
    return window.innerWidth <= this.MOBILE_BREAKPOINT;
  }
}
