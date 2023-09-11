import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/auth/entities/user.entity';
import { AuthenticatedUser } from 'src/auth/strategy/auth.guard.jwt';
import { CurrentUser } from 'src/auth/strategy/current.user.decorator';
import { S3Service } from 'src/common/aws/s3/s3.service';
import { ObjectIdValidationPipe } from 'src/common/pipes/valid-object-id';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { LegalDocumentService } from './legal-document.service';
import { CaseOwnerGuard } from 'src/common/guards/case-owner.guard';
import {
  AllowedDocumentType,
  documentMaxFileSize,
} from './entities/legal-document.entity';
import { legalDocFileFilter } from './filters/allowed-legal-document.filter';

@Controller('legal-document')
@UseGuards(AuthenticatedUser)
export class LegalDocumentController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly legalDocumentService: LegalDocumentService,
  ) {}

  // TODO: Make sure to not override files on s3
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: legalDocFileFilter,
      limits: { fileSize: documentMaxFileSize },
    }),
  )
  @UseGuards(CaseOwnerGuard)
  @Post('upload/:caseId')
  async createDocument(
    @Param('caseId', ObjectIdValidationPipe) caseId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
    @Body() uploadDocumentDto: UploadDocumentDto,
  ) {
    //file request will be undefined in legalDocFileFilter if not allowed
    if (!file) {
      throw new BadRequestException('Invalid file type.');
    }

    const filename = this.s3Service.filenameToS3Key(file.originalname);
    const path = `cases/${caseId}/${filename}`;

    console.log(file);

    const s3Params = {
      key: path,
      buffer: file.buffer,
    };

    const s3Object = await this.s3Service.uploadFile(s3Params);
    if (!s3Object) {
      throw new InternalServerErrorException(
        'Fail uploading and saving the document.',
      );
    }

    const newFile = {
      fileUrl: s3Object.Location,
      filename: filename,
      s3Key: s3Object.Key,
      bucketName: s3Object.Bucket,
      fileSize: file.size,
      mimeType: file.mimetype,
      type: uploadDocumentDto.type,
      label: uploadDocumentDto.label,
      case: caseId,
      user: user.id,
    };

    const newDocument = (
      await this.legalDocumentService.saveDocument(newFile)
    ).toObject();

    if (!newDocument) {
      //rollback delete file
      await this.s3Service.deleteFile({
        key: s3Object.Key,
        bucket: s3Object.Bucket,
      });
      throw new InternalServerErrorException(
        'Fail uploading and saving the document.',
      );
    }

    return {
      ...newDocument,
      message: 'Document uploaded successfully!',
    };
  }
}
