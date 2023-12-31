import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { Roles } from 'src/common/guards/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthenticatedUser } from 'src/auth/strategy/auth.guard.jwt';
import { CurrentUser } from 'src/auth/strategy/current.user.decorator';
import { CaseService } from './case.service';
import { ObjectIdValidationPipe } from 'src/common/pipes/valid-object-id';

@Controller('lawyer')
@Roles(['lawyer'])
@UseGuards(RolesGuard)
@UseGuards(AuthenticatedUser) //should run last so RolesGuard wont have an error
export class LawyerController {
  constructor(private readonly caseService: CaseService) {}

  @Get('case/:caseId/')
  async find(
    @Param('caseId', ObjectIdValidationPipe) caseId: string,
    @CurrentUser() user: User,
  ) {
    const singleCase = await this.caseService.findCaseByLawyer(
      user._id,
      caseId,
    );

    if (!singleCase) {
      throw new NotFoundException();
    }

    return singleCase;
  }

  @Get('cases')
  async findAllCaseByLawyer(@CurrentUser() user: User) {
    return await this.caseService.getAllCaseByLawyer(user._id);
  }
}
