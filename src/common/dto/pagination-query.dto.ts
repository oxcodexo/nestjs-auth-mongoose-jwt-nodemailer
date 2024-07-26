import { IsOptional, IsString } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  page?: string;

  @IsOptional()
  size?: string;

  @IsOptional()
  @IsString()
  searchValue?: string;

  @IsOptional()
  filter?: string;
}
