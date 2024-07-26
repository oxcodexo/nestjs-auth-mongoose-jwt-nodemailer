import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { PaginationService } from 'src/common/services/pagination.service';
import { Role, RoleSchema } from './role.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionModule } from 'src/permission/permission.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    PermissionModule,
  ],
  controllers: [RoleController],
  providers: [RoleService, PaginationService],
  exports: [RoleService],
})
export class RoleModule {}
