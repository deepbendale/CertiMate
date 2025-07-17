export interface Template{
    id:string;
    name: string;
    category: 'Academic' | 'Workshop' | 'Sports' | 'Event';
    orientation: 'Portrait' | 'Landscape';
    fontFamily: string;
    imageUrl: string;
    isActive: boolean;
    createdAt?:Date;
}

export interface TemplateUpload{
    name:string;
    category: 'Academic' | 'Workshop' | 'Sports' | 'Event';
    orientation: 'Portrait' | 'Landscape';
    fontFamily: string;
    imageFile : File;

    
}