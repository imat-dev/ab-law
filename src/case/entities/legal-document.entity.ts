import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../auth/entities/user.entity';
import { Case } from './case.entity';

export enum LegalDocumentType {
  Pleadings = 'pleadings',
  Motions = 'motions',
  Discovery = 'discover',
  PreTrial = 'pre-trial',
  Miscellaneous = 'miscellaneous',
}


@Schema()
export class LegalDocument extends Document {
  @Prop({ required: true })
  fileUrl: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  s3Key: string;

  @Prop({ required: true })
  bucketName: string;

  @Prop({ required: true })
  fileSize: number;

  @Prop({ required: true })
  mimeType: string;

  @Prop({
    required: true,
    enum: [
      LegalDocumentType.Discovery,
      LegalDocumentType.Miscellaneous,
      LegalDocumentType.Motions,
      LegalDocumentType.Pleadings,
      LegalDocumentType.PreTrial,
    ],
  })
  type: string;

  @Prop({ required: true })
  label: string;

  @Prop({ type: Date, default: Date.now })
  dateCreated: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Case' })
  case: Case;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const LegalDocumentSchema = SchemaFactory.createForClass(LegalDocument);
