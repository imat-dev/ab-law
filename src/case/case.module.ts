import { Controller, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Case, CaseSchema } from 'src/case/entities/case.entity';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import { CaseController } from './case.controller';
import { CaseService } from './case.service';
import { LawyerService } from './lawyer.service';
import { LawyerController } from './lawyer.controller';
import { LegalDocumentController } from './legal-document.controller';
import { S3Service } from 'src/common/aws/s3/s3.service';
import { LegalDocument, LegalDocumentSchema } from './entities/legal-document.entity';
import { LegalDocumentService } from './legal-document.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Case.name,
        schema: CaseSchema,
      },
      {
        name: LegalDocument.name,
        schema: LegalDocumentSchema,
      },
    ]),
  ],
  controllers: [CaseController, LawyerController, LegalDocumentController],
  providers: [CaseService, LawyerService, S3Service, LegalDocumentService],
})
export class CaseModule {}
