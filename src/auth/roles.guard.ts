import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'utils/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService, // Inject JwtService for decoding JWT
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      console.error('Authorization header missing');
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.error('Token missing');
      throw new UnauthorizedException('Token missing');
    }

    const payload = this.jwtService.decode(token) as any;
    if (!payload) {
      console.error('Failed to decode token');
      throw new UnauthorizedException('Invalid token');
    }

    if (!payload.roles) {
      console.error('Roles missing in token payload');
      throw new UnauthorizedException('Roles missing in token payload');
    }

    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    const hasRole = requiredRoles.some((role) => payload.roles.includes(role));

    if (!hasRole) {
      console.error('User does not have required roles');
      throw new UnauthorizedException('Access denied');
    }

    return true;
  }
}
