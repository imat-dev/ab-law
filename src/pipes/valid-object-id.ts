import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid ID Format');
    }
    return value;
  }
}