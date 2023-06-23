import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "./entities/role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    // does it have access?
    canActivate(context: ExecutionContext): boolean {
        //What the require role?
        const requireRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        //Libera acceso para los users que no sean ADMIN 
        if (!requireRoles) {
            return true;
        }

        const { User } = context.switchToHttp().getRequest();


        // does the current user making req have those req role?
        return requireRoles.some((role) => User.roles.includes(role))
    }
}