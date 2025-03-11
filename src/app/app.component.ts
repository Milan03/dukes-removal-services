import { Component, HostListener } from '@angular/core';
import { NgbNavModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, NgbNavModule, NgbAccordionModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  activeSection = 'home';
  contactForm: FormGroup;

  services = [
    "Dump Runs",
    "Yard Clean Up",
    "Heavy Lifting Around the House",
    "Furniture Removal",
    "Moving Services",
    "Backyard Pet Clean-up"
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Must be 10-digit number
      servicesRequested: this.fb.array([]), // Stores selected services
      description: [''] // Optional
    });
  }

  // Method to handle service selection
  toggleService(service: string, event: any) {
    const servicesArray = this.contactForm.controls['servicesRequested'].value;
    if (event.target.checked) {
      servicesArray.push(service);
    } else {
      const index = servicesArray.indexOf(service);
      if (index !== -1) servicesArray.splice(index, 1);
    }
  }

  // Handle form submission
  submitForm() {
    if (this.contactForm.valid) {
      console.log("Form Submitted Successfully:", this.contactForm.value);
      alert("Thank you! We will get back to you soon.");
      this.contactForm.reset(); // Reset after submission
    } else {
      alert("Please fill in all required fields correctly.");
    }
  }

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
