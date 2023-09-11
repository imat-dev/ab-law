import {
  Body,
  Controller,
  HttpException,
  InternalServerErrorException,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/auth/entities/user.entity';
import { Roles } from 'src/guards/roles.decorator';
import { AuthenticatedUser } from 'src/auth/strategy/auth.guard.jwt';
import { CurrentUser } from 'src/auth/strategy/current.user.decorator';
import { S3Service } from 'src/aws/s3/s3.service';
import { ObjectIdValidationPipe } from 'src/pipes/valid-object-id';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { LegalDocumentService } from './legal-document.service';
import { CaseOwnerGuard } from 'src/guards/case-owner.guard';

@Controller('legal-document')
@UseGuards(AuthenticatedUser)
export class LegalDocumentController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly legalDocumentService: LegalDocumentService,
  ) {}

  // TODO: Implement file extension filter here
  // TODO: Delete s3 when upload fails
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(CaseOwnerGuard)
  @Post('upload/:caseId')
  async createDocument(
    @Param('caseId', ObjectIdValidationPipe) caseId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
    @Body() uploadDocumentDto: UploadDocumentDto,
  ) {



    return true;
    const filename = this.s3Service.filenameToS3Key(file.originalname);
    const path = `cases/${caseId}/${filename}`;

    console.log(file);

    const s3Params = {
      key: path,
      buffer: file.buffer,
    };

    //check if Current User is allowed to upload in case, check if theyre client or lawyer
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

    const newDocument = (await this.legalDocumentService.saveDocument(newFile)).toObject();

    if (!newDocument) {
      throw new InternalServerErrorException(
        'Fail uploading and saving the document.',
      );
    }

    return {
      ...newDocument, 
      message : 'Document uploaded successfully!'
    };
  }
}
