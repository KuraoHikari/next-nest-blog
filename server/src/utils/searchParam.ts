import { ExecutionContext, createParamDecorator } from '@nestjs/common';
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

    const search = searchQuery.split('&').join(' & ');

    const sortObjects: Search = { [validParams]: { search: search } };

    return sortObjects;
  },
);
