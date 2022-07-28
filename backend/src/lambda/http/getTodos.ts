import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import Todo from '../../models/Todo';

import { getUserId } from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const _todo = new Todo()
    const userId = getUserId(event)
    
    const itemsPayload = await _todo.getTodosByUserId(userId)
    const { Items, Count } = itemsPayload

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: Items,
        count: Count
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
