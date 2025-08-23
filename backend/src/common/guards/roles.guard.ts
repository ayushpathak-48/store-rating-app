import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { Role } from "@prisma/client";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the required roles for this route
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If route has no role restrictions → allow access
    if (!requiredRoles) {
      return true;
    }

    // Get current logged-in user from request
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException("User not authenticated");
    }

    // Check if user's role matches allowed roles
    if (!requiredRoles.includes(user.role as Role)) {
      throw new ForbiddenException(
        `Access denied. Requires roles: ${requiredRoles.join(", ")}`,
      );
    }

    return true;
  }
}
