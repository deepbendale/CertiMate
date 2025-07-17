import { Component, OnInit } from '@angular/core';
import { CertificateFormData } from '../../models/certificate.model';
import { Template } from '../../models/template.model';
import { CertificateService } from '../../services/certificate.service';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-generate',
  imports: [CommonModule,FormsModule, NgIf, ],
  templateUrl: './generate.component.html',
  styleUrl: './generate.component.scss',
})
export class GenerateComponent implements OnInit {
  formData: CertificateFormData = {
    fullName: '',
    email: '',
    eventName: '',
    date: '',
    templateId: '',
    signature: null,
    logo: null,
  };

  templates: Template[] = [];
  selectedTemplate: Template | null = null;
  signaturePreview: string | null = null;
  logoPreview: string | null = null;
  isGenerating = false;
  isLoading = true;
  formErrors: string[]=[];

  constructor(
    private certificateService: CertificateService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.isLoading = true;
    this.certificateService.getTemplates().subscribe({
      next:(templates)=>{
        this.templates=templates;
        this.isLoading=false;
      },
      error:(error)=>{
        console.log("Error Loading Templates:", error);
        this.isLoading = false;
      }
    });
  }

  onTemplateSelect(template:Template):void{
    this.selectedTemplate  =template;
    this.formData.templateId = template.id;
    this.validateForm();
  }
  onSignatureUpload(event:Event):void{
    const file = (event.target as HTMLInputElement).files?.[0];
    if(file){
       // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file for signature');
        return;
      }
        // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Signature file size must be less than 5MB');
        return;
      }
       this.formData.signature = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.signaturePreview = e.target?.result as string;
        this.validateForm();
      };
      reader.readAsDataURL(file);
    }
  }

  onLogoUpload(event:Event):void{
    const file = (event.target as HTMLInputElement).files?.[0];
    if(file){
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file for logo');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Logo file size must be less than 5MB');
        return;
      }

      this.formData.logo = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.logoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  validateForm(): void {
    this.formErrors = this.certificateService.validateFormData(this.formData);
  }

  isFormValid(): boolean {
    return this.formErrors.length === 0 && this.isValidFormdata();
  }

  private isValidFormdata(): boolean{
    return !!(
      this.formData.fullName?.trim() &&
      this.formData.email?.trim() &&
      this.formData.eventName?.trim() &&
      this.formData.date &&
      this.formData.templateId &&
      this.formData.signature
    );
  }

  generatePDF(): void {
    if (!this.isFormValid()) {
      this.validateForm();
      alert('Please fix the form errors before generating PDF');
      return;
    }

    this.isGenerating = true;
    
    this.certificateService.generateCertificate(this.formData).subscribe({
      next: (certificate) => {
        console.log('Certificate generated:', certificate);
        
        // Now download PDF
        this.certificateService.downloadPDF(certificate).subscribe({
          next: (success) => {
            if (success) {
              alert(`PDF generated successfully! Verification code: ${certificate.verificationCode}`);
            }
            this.isGenerating = false;
          },
          error: (error) => {
            console.error('PDF generation error:', error);
            alert('Error generating PDF. Please try again.');
            this.isGenerating = false;
          }
        });
      },
      error: (error) => {
        console.error('Certificate generation error:', error);
        alert('Error generating certificate. Please try again.');
        this.isGenerating = false;
      }
    });
  }

sendEmail(): void {
    if (!this.isFormValid()) {
      this.validateForm();
      alert('Please fix the form errors before sending email');
      return;
    }

    this.isGenerating = true;
    
    this.certificateService.generateCertificate(this.formData).subscribe({
      next: (certificate) => {
        console.log('Certificate generated:', certificate);
        
        // Now send email
        this.certificateService.sendEmail(certificate).subscribe({
          next: (success) => {
            if (success) {
              alert(`Certificate sent to ${certificate.email} successfully! Verification code: ${certificate.verificationCode}`);
            }
            this.isGenerating = false;
          },
          error: (error) => {
            console.error('Email sending error:', error);
            alert('Error sending email. Please try again.');
            this.isGenerating = false;
          }
        });
      },
      error: (error) => {
        console.error('Certificate generation error:', error);
        alert('Error generating certificate. Please try again.');
        this.isGenerating = false;
      }
    });
  }

 // Helper method to get template by category
  getTemplatesByCategory(category: string): Template[] {
    return this.templates.filter(template => template.category === category);
  }

  // Helper method to clear form
  clearForm(): void {
    this.formData = {
      fullName: '',
      email: '',
      eventName: '',
      date: '',
      templateId: '',
      signature: null,
      logo: null
    };
    this.selectedTemplate = null;
    this.signaturePreview = null;
    this.logoPreview = null;
    this.formErrors = [];
  }

  // Navigate back to home
  goBack(): void {
    this.router.navigate(['/']);
  }
}
