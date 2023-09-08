import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Case } from 'entities/case.entity';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

@Injectable()
export class LawyerService {
  constructor(
    @InjectModel(Case.name)
    private readonly caseModel: Model<Case>,
  ) {}

}
