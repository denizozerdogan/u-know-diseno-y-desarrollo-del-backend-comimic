


/* import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";

@Injectable()

export class AdminGuard implements CanActivate {
    constructor(
      private jwtService: JwtService,
      private userService: UserService,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const roles = [UserRole.Admin]; // Specify the roles that are allowed access
  
      const request = context.switchToHttp().getRequest();
      const token = this._extractTokenFromHeader(request)// Retrieve the token from the request headers or cookies
      const decodedToken = this.jwtService.verify(token); // Verify and decode the token
  
      const userEmail = decodedToken.email;
      const user = await this.userService.getUserByEmail(userEmail);
  
      if (!user || user.role !== UserRole.Admin) {
        return false; // User not found or role is not allowed, deny access
      }
  
      request.user = user; // Attach the user object to the request for further processing
  
      return true; // User is an admin, grant access
    }

    private _extractTokenFromHeader(request:Request){
        const [type, token] = request.headers.authorization.split('') ?? [] //Bearer qsdfskjfjskjajd ->this is the token
        return type === 'Bearer' ? token : undefined;
      }
    
  }

  @Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles || roles.length === 0 || !roles.includes(UserRole.Admin)) {
      return true; // No roles specified or admin role not required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user.id; // Assuming you have middleware that sets the user object in the request

    if (!userId) {
      return false; // User ID not available, deny access
    }

    const user = await this.userService.getUserById(userId); // Fetch the user from the database by ID

    if (!user || user.role !== UserRole.Admin) {
      return false; // User not found or role is not "admin", deny access
    }

    return true; // User is an admin, grant access
  }
}
 */