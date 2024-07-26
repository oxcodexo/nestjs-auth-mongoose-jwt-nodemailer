import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PaginationService } from 'src/common/services/pagination.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Role, RoleDocument } from './role.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    private paginationService: PaginationService,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const savedRole = await this.roleModel.create(createRoleDto);
    await savedRole.populate({
      path: 'permissions',
      model: 'Permission',
    });

    return { data: savedRole };
  }

  async findAll(query: PaginationQueryDto) {
    const { limit, skip } = this.paginationService.getPaginationOptions(query);
    const exp = await this.buildSearchExpression(query);

    const roles = await this.roleModel
      .find(exp)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate({
        path: 'permissions',
        model: 'Permission',
      })
      .exec();

    const rolesCount = await this.roleModel.countDocuments(exp);
    return {
      data: roles,
      dataCount: rolesCount,
    };
  }
  async findOne(id: string) {
    const role = await this.roleModel.findById(id).populate({
      path: 'permissions',
      model: 'Permission',
    });

    return { data: role };
  }

  async findRoleIdByName(roleName: string) {
    return await this.roleModel.findOne({ name: roleName });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    await this.roleModel.findByIdAndUpdate(id, updateRoleDto);
    const updatedRolePopulated = this.findOne(id);

    return { data: updatedRolePopulated };
  }

  remove(id: string) {
    return this.roleModel.findByIdAndDelete(id);
  }

  private async buildSearchExpression(query: PaginationQueryDto) {
    const { searchValue } = query;
    let searchExp = {};

    if (searchValue) {
      const searchRegex = new RegExp(searchValue, 'i');

      searchExp = {
        $or: [{ name: searchRegex }],
      };
    }

    return { $and: [searchExp, {}] };
  }
}
