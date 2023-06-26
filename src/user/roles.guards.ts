import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "./entities/role.enum";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean{
        //what is the required role?
        const requireRole = this.reflector.getAllAndOverride<Role>('roles',[
        context.getHandler(),
        context.getClass(),
    ]);

        if(!requireRole){
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        //does the current user making the request have those required role(s)
        return requireRole === user.role;;

    }
}