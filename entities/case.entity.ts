import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.entity';

export enum CaseStatus {
  Ongoing = 'ongoing',
  Pending = 'pending',
  Closed = 'closed',
}

export enum CaseType {
  Civil = 'civil',
  Criminal = 'criminal',
  Family = 'family',
}

export enum ClientType {
  Plaintiff = 'plaintiff',
  Defendant = 'defendant',
}

@Schema()
export class Case extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    type: String,
    enum: [CaseType.Civil, CaseType.Criminal, CaseType.Family],
  })
  type: string;

  @Prop({
    required: true,
    type: String,
    enum: [CaseStatus.Ongoing, CaseStatus.Pending, CaseStatus.Closed],
    default: CaseStatus.Ongoing,
  })
  status: string;

  @Prop({
    required: true,
    type: Date,
  })
  filingDate: Date;

  @Prop({ type: Date, default: Date.now })
  dateCreated: Date;

  @Prop({
    required: true,
    type: String,
    enum: [ClientType.Plaintiff, ClientType.Defendant],
  })
  clientType: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  client: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  lawyer: User;
}

export const CaseSchema = SchemaFactory.createForClass(Case);
