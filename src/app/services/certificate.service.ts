import { Injectable } from '@angular/core';
import { Template } from '../models/template.model';
import { delay, Observable, of } from 'rxjs';
import { Certificate, CertificateFormData } from '../models/certificate.model';

@Injectable({
  providedIn: 'root',
})
export class CertificateService {
  private certificates: Certificate[] = [];
  private templates: Template[] = [
    {
      id: '1',
      name: 'Academic Achievement',
      category: 'Academic',
      orientation: 'Portrait',
      fontFamily: 'Georgia',
      imageUrl: 'assets/templates/academic-1.jpg',
      isActive: true,
    },
    {
      id: '2',
      name: 'Workshop Completion',
      category: 'Workshop',
      orientation: 'Landscape',
      fontFamily: 'Arial',
      imageUrl: 'assets/templates/workshop-1.jpg',
      isActive: true,
    },
    {
      id: '3',
      name: 'Sports Achievement',
      category: 'Sports',
      orientation: 'Portrait',
      fontFamily: 'Roboto',
      imageUrl: 'assets/templates/sports-1.jpg',
      isActive: true,
    },
    {
      id: '4',
      name: 'Event Participation',
      category: 'Event',
      orientation: 'Landscape',
      fontFamily: 'Montserrat',
      imageUrl: 'assets/templates/event-1.jpg',
      isActive: true,
    },
    {
      id: '5',
      name: 'Programming Workshop',
      category: 'Workshop',
      orientation: 'Portrait',
      fontFamily: 'Source Sans Pro',
      imageUrl: 'assets/templates/workshop-2.jpg',
      isActive: true,
    },
    {
      id: '6',
      name: 'Sports Tournament',
      category: 'Sports',
      orientation: 'Landscape',
      fontFamily: 'Oswald',
      imageUrl: 'assets/templates/sports-2.jpg',
      isActive: true,
    },
  ];

  constructor() {}

  //geting active template
  getTemplates(): Observable<Template[]> {
    return of(this.templates.filter((template) => template.isActive)).pipe(
      delay(300)
    );
  }

  //get templates by category
  getTemplatesByCategory(category: string): Observable<Template[]> {
    return of(
      this.templates.filter(
        (template) => template.category === category && template.isActive
      )
    ).pipe(delay(300));
  }

  // get template by

  getTemplateById(id: string): Observable<Template | null> {
    const template = this.templates.find((t) => t.id === id) || null;
    return of(template).pipe(delay(200));
  }

  //generate certificate
  generateCertificate(formData: CertificateFormData): Observable<Certificate> {
    const certificate: Certificate = {
      id: this.generateId(),
      fullName: formData.fullName,
      email: formData.email,
      eventName: formData.eventName,
      date: formData.date,
      templateId: formData.templateId,
      signatureId: formData.signature ? this.generateId() : '',
      logoUrl: formData.logo ? this.generateImageUrl() : undefined,
      verificationCode: this.generateVerificationCode(),
      createdAt: new Date(),
    };

    this.certificates.push(certificate);
    return of(certificate).pipe(delay(1000));
  }


  
  // Validate form data
  validateFormData(formData: CertificateFormData): string[] {
    const errors: string[] = [];

    if (!formData.fullName?.trim()) {
      errors.push('Full name is required');
    }

    if (!formData.email?.trim()) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!formData.eventName?.trim()) {
      errors.push('Event name is required');
    }

    if (!formData.date) {
      errors.push('Date is required');
    }

    if (!formData.templateId) {
      errors.push('Please select a template');
    }

    if (!formData.signature) {
      errors.push('Signature is required');
    }

    return errors;
  }

  // Helper methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateVerificationCode(): string {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  }

  private generateImageUrl(): string {
    return `assets/uploads/${this.generateId()}.jpg`;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  //download pdf
  downloadPDF(certificate: Certificate): Observable<boolean> {
    console.log('Downloading PDF for certificate:', certificate.id);
    // Here we would integrate jsPDF + html2canvas
    return of(true).pipe(delay(2000));
  }
  //send email
  sendEmail(certificate: Certificate): Observable<boolean> {
    console.log('Sending email for certificate:', certificate.id);
    // Here we would call backend API
    return of(true).pipe(delay(1500));
  }

  // Verify certificate by code
  verifyCertificate(code: string): Observable<Certificate | null> {
    const certificate =
      this.certificates.find((cert) => cert.verificationCode === code) || null;
    return of(certificate).pipe(delay(800));
  }

  // Get all certificates (for admin)
  getAllCertificates(): Observable<Certificate[]> {
    return of(this.certificates).pipe(delay(500));
  }

  // Convert file to base64 (helper method)
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

}
