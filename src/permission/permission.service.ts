import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from './permission.schema';
import { Model } from 'mongoose';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const newPermission =
      await this.permissionModel.create(createPermissionDto);
    return await newPermission.save();
  }

  async findAll() {
    return await this.permissionModel.find();
  }

  async findById(id: number) {
    return await this.permissionModel.findById(id);
  }

  async findOne() {
    return await this.permissionModel.findOne({});
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return updatePermissionDto;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
