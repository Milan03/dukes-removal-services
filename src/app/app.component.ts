import { Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbNavModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CommonModule, NgbNavModule, NgbAccordionModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  activeSection = 'home';
  contactForm: FormGroup;

  socialLinks = [
    { name: 'Facebook', icon: 'bi-facebook', url: 'https://facebook.com/yourpage' },
    { name: 'Instagram', icon: 'bi-instagram', url: 'https://instagram.com/yourpage' },
    { name: 'Twitter', icon: 'bi-twitter', url: 'https://twitter.com/yourpage' }
  ];

  services = [
    "Dump Runs",
    "Yard Clean Up",
    "Heavy Lifting Around the House",
    "Furniture Removal",
    "Moving Services",
    "Backyard Pet Clean-up"
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      contactMethod: ['phone', Validators.required], // Default to Phone
      phone: ['', [Validators.pattern(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/)]], // Validates multiple formats
      email: ['', [Validators.email]], // Email validation
      servicesRequested: this.fb.array([]), // Stores selected services
      description: ['']
    });

    // Listen for changes in contactMethod and update validation dynamically
    this.contactForm.get('contactMethod')?.valueChanges.subscribe((method) => {
      if (method === 'phone') {
        this.contactForm.get('phone')?.setValidators([Validators.required, Validators.pattern(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/)]);
        this.contactForm.get('email')?.clearValidators();
      } else {
        this.contactForm.get('email')?.setValidators([Validators.required, Validators.email]);
        this.contactForm.get('phone')?.clearValidators();
      }
      this.contactForm.get('phone')?.updateValueAndValidity();
      this.contactForm.get('email')?.updateValueAndValidity();
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
  async submitForm() {
    if (this.contactForm.valid) {
      try {
        const response = await firstValueFrom(
          this.http.post('http://localhost:5000/send-email', this.contactForm.value)
        );
        console.log('Email sent successfully!', response);
        alert('Email sent successfully!');
      } catch (error) {
        console.error('Error sending email:', error);
        alert('Error sending email.');
      }
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
