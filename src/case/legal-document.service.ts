import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LegalDocument } from './entities/legal-document.entity';
import { Model } from 'mongoose';
import { UploadDocumentDto } from './dto/upload-document.dto';

@Injectable()
export class LegalDocumentService {
  constructor(
    @InjectModel(LegalDocument.name)
    private readonly legalDocumentModel: Model<LegalDocument>,
  ) {}

  public async saveDocument(
    document: UploadDocumentDto,
  ): Promise<LegalDocument> {
    return await this.legalDocumentModel.create(document);
  }
}
