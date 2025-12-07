import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css'],
})
export class MainLayout implements OnInit, AfterViewInit, OnDestroy {
  private scrollListener: any;

  ngOnInit() {
    // Add index-page class to body
    document.body.classList.add('index-page');
  }

  ngAfterViewInit() {
    // Initialize components after view is fully loaded
    setTimeout(() => {
      this.initializeComponents();
      this.setupEventListeners();
    }, 300);
  }

  ngOnDestroy() {
    // Remove index-page class when component is destroyed
    document.body.classList.remove('index-page');

    // Clean up event listeners
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  private initializeComponents() {
    // Initialize AOS (Animate On Scroll)
    if (typeof (window as any).AOS !== 'undefined') {
      (window as any).AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }

    // Initialize GLightbox
    if (typeof (window as any).GLightbox !== 'undefined') {
      (window as any).GLightbox({
        selector: '.glightbox'
      });
    }

    // Initialize Swiper for any carousels
    if (typeof (window as any).Swiper !== 'undefined') {
      const swipers = document.querySelectorAll('.swiper');
      swipers.forEach((swiper: any) => {
        new (window as any).Swiper(swiper, {
          loop: true,
          speed: 600,
          autoplay: {
            delay: 5000
          },
          slidesPerView: 'auto',
          pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
          }
        });
      });
    }

    // Initialize Isotope for portfolio
    if (typeof (window as any).imagesLoaded !== 'undefined' && typeof (window as any).Isotope !== 'undefined') {
      const portfolioContainer = document.querySelector('.isotope-container');
      if (portfolioContainer) {
        (window as any).imagesLoaded(portfolioContainer, () => {
          const isotope = new (window as any).Isotope(portfolioContainer, {
            itemSelector: '.portfolio-item',
            layoutMode: 'masonry'
          });

          // Filter functionality
          const filters = document.querySelectorAll('.isotope-filters li');
          filters.forEach(filter => {
            filter.addEventListener('click', function(this: HTMLElement) {
              filters.forEach(f => f.classList.remove('filter-active'));
              this.classList.add('filter-active');
              const filterValue = this.getAttribute('data-filter');
              isotope.arrange({ filter: filterValue });
            });
          });
        });
      }
    }
  }

  private setupEventListeners() {
    // Mobile nav toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    if (mobileNavToggle) {
      mobileNavToggle.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('#navmenu')?.classList.toggle('mobile-nav-active');
        mobileNavToggle.classList.toggle('bi-list');
        mobileNavToggle.classList.toggle('bi-x');
      });
    }

    // Close mobile nav on link click
    document.querySelectorAll('#navmenu a').forEach(link => {
      link.addEventListener('click', () => {
        if (document.querySelector('#navmenu')?.classList.contains('mobile-nav-active')) {
          document.querySelector('#navmenu')?.classList.remove('mobile-nav-active');
          const toggle = document.querySelector('.mobile-nav-toggle');
          toggle?.classList.add('bi-list');
          toggle?.classList.remove('bi-x');
        }
      });
    });

    // Dropdown toggles in mobile nav
    document.querySelectorAll('.navmenu .toggle-dropdown').forEach(toggle => {
      toggle.addEventListener('click', function(this: HTMLElement, e) {
        e.preventDefault();
        const parent = this.parentElement;
        parent?.classList.toggle('active');
        parent?.nextElementSibling?.classList.toggle('dropdown-active');
        e.stopImmediatePropagation();
      });
    });

    // Scroll top button
    const scrollTop = document.querySelector('#scroll-top');
    if (scrollTop) {
      this.scrollListener = () => {
        if (window.scrollY > 100) {
          scrollTop.classList.add('active');
        } else {
          scrollTop.classList.remove('active');
        }
      };

      window.addEventListener('scroll', this.scrollListener);

      scrollTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    // Header scroll effect
    const header = document.querySelector('#header');
    if (header) {
      const headerScrolled = () => {
        if (window.scrollY > 100) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      };

      window.addEventListener('scroll', headerScrolled);
      headerScrolled();
    }

    // Navmenu scrollspy
    const navmenulinks = document.querySelectorAll('.navmenu a');
    const navmenuScrollspy = () => {
      navmenulinks.forEach(navmenulink => {
        const link = navmenulink as HTMLAnchorElement;
        if (!link.hash) return;
        const section = document.querySelector(link.hash);
        if (!section) return;
        const position = window.scrollY + 200;
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionBottom = sectionTop + (section as HTMLElement).offsetHeight;

        if (position >= sectionTop && position <= sectionBottom) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    };    window.addEventListener('load', navmenuScrollspy);
    window.addEventListener('scroll', navmenuScrollspy);
  }
}
