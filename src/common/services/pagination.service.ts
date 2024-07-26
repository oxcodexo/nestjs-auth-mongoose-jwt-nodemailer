import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dto/pagination-query.dto';

@Injectable()
export class PaginationService {
  getPaginationOptions(queryParams: PaginationQueryDto) {
    const { page, size } = queryParams;
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(size, 10) || Number.MAX_SAFE_INTEGER;
    const skip = (pageNumber - 1) * pageSize;

    return {
      limit: pageSize,
      skip,
    };
  }
}
