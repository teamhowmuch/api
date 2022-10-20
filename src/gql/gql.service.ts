import { Injectable } from '@nestjs/common'
import { GraphQLClient } from 'graphql-request'

@Injectable()
export class GqlService {
  public client = new GraphQLClient(process.env.HYGRAPH_ENDPOINT, {
    headers: { Authorization: `Bearer ${process.env.HYGRAPH_TOKEN as string}` },
  })
}
