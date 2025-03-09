import { Component, HostListener } from '@angular/core';
import { NgbNavModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, NgbNavModule, NgbAccordionModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  activeSection = 'home';

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPosition = window.scrollY + 100; // Adjust for navbar height

    if (scrollPosition < document.getElementById('services')!.offsetTop) {
      this.activeSection = 'home';
    } else if (scrollPosition < document.getElementById('contact')!.offsetTop) {
      this.activeSection = 'services';
    } else {
      this.activeSection = 'contact';
    }
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    this.activeSection = sectionId;
  }
}
