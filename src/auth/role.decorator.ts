import { SetMetadata } from '@nestjs/common';
import { Role } from 'utils/enums';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
