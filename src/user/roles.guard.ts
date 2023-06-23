import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "./entities/role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    // does it have access?
    canActivate(context: ExecutionContext): boolean {
        //What the require role?
        const requireRole = this.reflector.getAllAndOverride<Role>('role', [
            context.getHandler(),
            context.getClass(),
        ]);

        //Libera acceso para los users que no sean ADMIN 
        if (!requireRole) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();


        // does the current user making req have those req role?
        return requireRole === user.role; 
        //return requireRole.some((role) => User.role.includes(role))
       
    }
}