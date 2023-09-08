import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'entities/user.entity';
import { Roles } from 'guards/roles.decorator';
import { AuthenticatedUser } from 'src/auth/strategy/auth.guard.jwt';
import { CurrentUser } from 'src/auth/strategy/current.user.decorator';
import { S3Service } from 'src/aws/s3/s3.service';
import { ObjectIdValidationPipe } from 'src/pipes/valid-object-id';

@Controller('legal-document')
@UseGuards(AuthenticatedUser)
export class LegalDocumentController {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload/:caseId')
  @UseInterceptors(FileInterceptor('file'))
  async createDocument(
    @Param('caseId', ObjectIdValidationPipe) caseId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {

    const filename = this.s3Service.filenameToS3Key(file.originalname);
    const path = `cases/${caseId}/${filename}`;

    const newDocument = {
      key: path,
      buffer: file.buffer,
    };

    //check if Current User is allowed to upload in case, check if theyre client or lawyer

    const isUploaded = await this.s3Service.uploadFile(newDocument);
    console.log(isUploaded);
    return 'test';
  }
}
