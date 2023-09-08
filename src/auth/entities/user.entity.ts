import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Case } from '../../case/entities/case.entity';

export enum UserRole {
  Admin = 'admin',
  Client = 'client',
  Lawyer = 'lawyer',
}

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true, message: 'Email must be unique' })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({
    required: true,
    type: [String],
    enum: [UserRole.Admin, UserRole.Client, UserRole.Lawyer],
    default: [UserRole.Client],
  })
  roles: UserRole[];

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: Case.name }] })
  cases: Case[];
}

export const UserSchema = SchemaFactory.createForClass(User);
