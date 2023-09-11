import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Roles } from './roles.decorator';
import { Logger } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
	private readonly logger = new Logger(RolesGuard.name);

	constructor(private readonly reflector: Reflector) {}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		//const allowedRoles = this.reflector.get(Roles, context.getHandler()); // get roles of @Get @Post etc. only

		const request = context.switchToHttp().getRequest();

		//get roles of controller, request(@Post, @Get) and combines it
		const allowedRoles = this.reflector.getAllAndOverride(Roles, [
			context.getHandler(),
			context.getClass(),
		]);

		//USER request object is in HTTP REQUEST OBJ because of jwt.strategy.ts(make sure that you Inject in controlelr the @UseGuards(JWTGUARD) to mke this work)
		const userRoles = request.user.roles;

		const isAllowed = userRoles.find((userRole) =>
			allowedRoles.includes(userRole)
		);

		if (isAllowed) {
			return true;
		}

		this.logger.debug(`User roles not allowed`);
		return false;
	}
}
