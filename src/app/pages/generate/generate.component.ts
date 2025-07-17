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

  constructor(
    private certificateService: CertificateService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.templates = [
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
    ];
  }

  onTemplateSelect(template:Template):void{
    this.selectedTemplate  =template;
    this.formData.templateId = template.id;
  }
  onSignatureUpload(event:Event):void{
    const file = (event.target as HTMLInputElement).files?.[0];
    if(file){
      this.formData.signature = file;
      const reader = new FileReader();
      reader.onload = (e)=>{
        this.signaturePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onLogoUpload(event:Event):void{
    const file = (event.target as HTMLInputElement).files?.[0];
    if(file){
      this.formData.logo = file;
      const reader = new FileReader();
      reader.onload=(e)=>{
        this.logoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  generatePDF():void{
    if(!this.isFormValid()){
      alert('Please fill all the required fields');
      return;
    }
    this.isGenerating=true;
    console.log("Generating pdf with data: ", this.formData);
    setTimeout(()=>{
      this.isGenerating=false;
      alert("PDF generated successsfully")
    }, 2000);
  }
  sendEmail():void{
    if (!this.isFormValid()) {
      alert('Please fill all required fields');
      return;
    }

    this.isGenerating = true;
    console.log('Sending email with data:', this.formData);

    setTimeout(() => {
      this.isGenerating = false;
      alert('Certificate sent to email successfully!');
    }, 2000);
  }

   public isFormValid(): boolean {
    return !!(
      this.formData.fullName &&
      this.formData.email &&
      this.formData.eventName &&
      this.formData.date &&
      this.formData.templateId &&
      this.formData.signature
    );
  }
}
