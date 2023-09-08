import { Controller, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Case, CaseSchema } from 'entities/case.entity';
import { User, UserSchema } from 'entities/user.entity';
import { CaseController } from './case.controller';
import { CaseService } from './case.service';
import { LawyerService } from './lawyer.service';
import { LawyerController } from './lawyer.controller';
import { LegalDocumentController } from './legal-document.controller';
import { S3Service } from 'src/aws/s3/s3.service';
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
    ]),
  ],
  controllers: [CaseController, LawyerController, LegalDocumentController],
  providers: [CaseService, LawyerService, S3Service],
})
export class CaseModule {}
