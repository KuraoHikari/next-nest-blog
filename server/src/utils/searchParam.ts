import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';

export interface Search {
  [x: string]: {
    search: string;
  };
}

export const SearchParams = createParamDecorator(
  (validParams: string, ctx: ExecutionContext): Search => {
    const req: Request = ctx.switchToHttp().getRequest();

    const searchQuery = req.query.search as string;

    if (!searchQuery) return {};

    const [property, value] = searchQuery.split(':');

    if (property !== validParams) {
      throw new BadRequestException('Invalid search parameter');
    }

    const search = value.split(' ').join(' & ');

    const sortObjects: Search = { [property]: { search: search } };

    return sortObjects;
  },
);
