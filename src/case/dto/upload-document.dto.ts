import { IsEnum, IsNotEmpty } from 'class-validator';
import { LegalDocumentType } from '../entities/legal-document.entity';

export class UploadDocumentDto {
  @IsNotEmpty()
  label: string;

  @IsEnum(LegalDocumentType)
  type: string;

  fileUrl: any;
  filename: string;
  s3Key: any;
  bucketName: any;
  fileSize: number;
  mimeType: string;
  case: string;
  user: any;
}
