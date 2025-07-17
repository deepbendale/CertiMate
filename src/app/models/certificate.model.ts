export interface Certificate{
    id?: string;
    fullName: string;
    email:string;
    eventName:string;
    date:string;
    templateId: string;
    signatureId: string;
    logoUrl?:string;
    verificationCode?:string;
    createdAt?:Date;
}

export interface CertificateFormData{
    fullName:string;
    email:string;
    eventName:string;
    date:string;
    templateId: string;
    signature : File | null;
    logo: File|null;
}