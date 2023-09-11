import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Case } from 'src/case/entities/case.entity';

@Injectable()
export class CaseOwnerGuard implements CanActivate {
  constructor(
    @InjectModel(Case.name)
    private readonly caseModel: Model<Case>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, params } = context.switchToHttp().getRequest();

    const findParams = {
      $and: [
        { _id: params.caseId },
        { $or: [{ client: user._id }, { lawyer: user._id }] },
      ],
    };

    const result = await this.caseModel.findOne(findParams, {'_id': 1});
    console.log(result);

    if (result) {
      return true;
    }

    return false;
  }
}
