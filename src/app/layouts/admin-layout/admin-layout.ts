import { Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

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
    // Angular way: Sidebar collapse functionality
    const sidebarCollapseBtn = this.el.nativeElement.querySelector('#sidebarCollapse');
    const sidebar = this.el.nativeElement.querySelector('#sidebar');

    if (sidebarCollapseBtn && sidebar) {
      this.renderer.listen(sidebarCollapseBtn, 'click', () => {
        if (sidebar.classList.contains('active')) {
          this.renderer.removeClass(sidebar, 'active');
        } else {
          this.renderer.addClass(sidebar, 'active');
        }
      });
    }
  }
}
