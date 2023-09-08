import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Case } from 'src/case/entities/case.entity';
import { Model } from 'mongoose';
import { CreateCaseDto } from './dto/create-case.dto';

@Injectable()
export class CaseService {
  constructor(
    @InjectModel(Case.name)
    private readonly caseModel: Model<Case>,
  ) {}

  public async createCase(caseDto: CreateCaseDto): Promise<Case> {
    return await this.caseModel.create(caseDto);
  }

  public async getAllCaseByLawyer(userId: string): Promise<Case[]> {
    console.log(userId)
    return await this.caseModel.find({ lawyer: userId });
  }

  public async findCaseByLawyer(userId: string, caseId: string): Promise<Case> {
    return await this.caseModel.findOne({ lawyer: userId, _id: caseId });
  }
}
