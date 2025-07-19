import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CertificateService } from '../../services/certificate.service';
import { Certificate } from '../../models/certificate.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.scss'
})
export class VerifyComponent implements OnInit {
  verificationCode: string = '';
  verifiedCertificate: Certificate | null = null;
  isLoading: boolean = false;
  isVerified: boolean = false;
  isError: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private certificateService: CertificateService
  ) {}

  ngOnInit(): void {
    // Check if verification code is provided in the URL
    this.route.params.subscribe(params => {
      if (params['code']) {
        this.verificationCode = params['code'].toUpperCase();
        this.verifyCertificate();
      }
    });
  }

  verifyCertificate(): void {
    if (!this.verificationCode?.trim()) {
      return;
    }

    this.isLoading = true;
    this.isVerified = false;
    this.isError = false;
    this.errorMessage = '';

    // Clean and format the verification code
    const cleanCode = this.verificationCode.trim().toUpperCase();

    console.log('Verifying certificate with code:', cleanCode);

    this.certificateService.verifyCertificate(cleanCode).subscribe({
      next: (certificate) => {
        this.isLoading = false;
        
        if (certificate) {
          console.log('Certificate found:', certificate);
          this.verifiedCertificate = certificate;
          this.isVerified = true;
          this.isError = false;
        } else {
          console.log('Certificate not found');
          this.handleVerificationError('Certificate not found');
        }
      },
      error: (error) => {
        console.error('Verification error:', error);
        this.isLoading = false;
        this.handleVerificationError('Error occurred while verifying certificate');
      }
    });
  }

  private handleVerificationError(message: string): void {
    this.isVerified = false;
    this.isError = true;
    this.errorMessage = message;
    this.verifiedCertificate = null;
  }

  verifyAnother(): void {
    this.resetState();
    // Update URL to remove the verification code
    this.router.navigate(['/verify'], { replaceUrl: true });
  }

  tryAgain(): void {
    this.resetState();
    // Update URL to remove the verification code
    this.router.navigate(['/verify'], { replaceUrl: true });
  }

  private resetState(): void {
    this.verificationCode = '';
    this.verifiedCertificate = null;
    this.isLoading = false;
    this.isVerified = false;
    this.isError = false;
    this.errorMessage = '';
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return 'N/A';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  }

  // Helper method to validate verification code format
  isValidVerificationCode(code: string): boolean {
    if (!code) return false;
    
    // Basic validation: 8 characters, alphanumeric
    const codeRegex = /^[A-Z0-9]{8}$/;
    return codeRegex.test(code.trim().toUpperCase());
  }

  // Handle form submission
  onSubmit(): void {
    if (this.isValidVerificationCode(this.verificationCode)) {
      this.verifyCertificate();
    } else {
      alert('Please enter a valid 8-character verification code');
    }
  }

  // Format verification code as user types
  onCodeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Limit to 8 characters
    if (value.length > 8) {
      value = value.substring(0, 8);
    }
    
    this.verificationCode = value;
  }

  // Navigate to different pages
  goToGenerate(): void {
    this.router.navigate(['/generate']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  // Copy verification code to clipboard
  copyVerificationCode(): void {
    if (this.verifiedCertificate?.verificationCode) {
      navigator.clipboard.writeText(this.verifiedCertificate.verificationCode).then(() => {
        // You could add a toast notification here
        console.log('Verification code copied to clipboard');
      }).catch(err => {
        console.error('Failed to copy verification code:', err);
      });
    }
  }

  // Print certificate details
  printCertificate(): void {
    if (this.verifiedCertificate) {
      window.print();
    }
  }
}