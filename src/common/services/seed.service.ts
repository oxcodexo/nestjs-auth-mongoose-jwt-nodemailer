import * as PermissionsJSONData from '../../data/permissions.json';
import { Injectable } from '@nestjs/common';
import { PermissionService } from '@/permission/permission.service';
import { RoleService } from '@/role/role.service';
import { DEV_ROLE } from '@/common/constants';
import { UserService } from '@/user/user.service';
import { CreateUserDto } from '@/user/dto/create-user.dto';

@Injectable()
export class SeedService {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  async InitializeData() {
    await this.InitializePermissionsData();
    await this.InitializeRolesData();
    await this.InitializeAdminUserData();
  }

  private async InitializePermissionsData() {
    const _permission = await this.permissionService.findOne();

    if (!_permission) {
      for (const permission of PermissionsJSONData)
        await this.permissionService.create(permission);
    }
  }

  async InitializeRolesData() {
    const devRole = await this.roleService.findRoleIdByName(DEV_ROLE);

    if (!devRole) {
      const permissions = await this.permissionService.findAll();
      const permissionsIds = permissions.map((permission) => permission._id);

      const data = {
        name: DEV_ROLE,
        permissions: permissionsIds,
      };
      await this.roleService.create(data);
    }
  }

  async InitializeAdminUserData() {
    const adminUser = await this.userService.findOne({});

    if (!adminUser) {
      const devRole = await this.roleService.findRoleIdByName(DEV_ROLE);

      const data: CreateUserDto = {
        firstName: 'admin',
        lastName: 'admin',
        password: 'admin',
        verified: true,
        email: 'admin@email.com',
        confirmationToken: '',
        roles: [devRole._id],
      };

      await this.userService.createInitialUser(data);
    }
  }
}
