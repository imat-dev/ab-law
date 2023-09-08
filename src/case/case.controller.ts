import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateCaseDto } from './dto/create-case.dto';
import { CaseService } from './case.service';
import { AuthenticatedUser } from 'src/auth/strategy/auth.guard.jwt';
import { Roles } from 'guards/roles.decorator';
import { RolesGuard } from 'guards/roles.guard';
import { CurrentUser } from 'src/auth/strategy/current.user.decorator';
import { User } from 'entities/user.entity';

@Controller('cases')
@UseGuards(AuthenticatedUser)
export class CaseController {
  constructor(private readonly caseService: CaseService) {}

  @Roles(['admin'])
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() caseDto: CreateCaseDto) {
    caseDto.filingDate = new Date(caseDto.filingDate);
    return await this.caseService.createCase(caseDto);
  }

  

}
