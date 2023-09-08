import {
  IsAlpha,
  IsDate,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';
import { CaseType, ClientType } from 'src/case/entities/case.entity';

export class CreateCaseDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsEnum(CaseType)
  type: string;

  @IsDateString()
  @IsNotEmpty()
  filingDate: Date;

  @IsEnum(ClientType)
  clientType: string;

  @IsMongoId()
  @IsNotEmpty()
  client: string;

  @IsMongoId()
  @IsNotEmpty()
  lawyer: string;
}
