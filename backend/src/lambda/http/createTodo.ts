import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { v4 as uuidv4 } from "uuid"
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'
import Todo, { TodoItem } from '../../models/Todo'

const logger = createLogger('createTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Creating todo")

    const _todo = new Todo()

    try {
      const newTodo: CreateTodoRequest = JSON.parse(event.body)
      const todoId: string = uuidv4()
      const todoItem: TodoItem = {
        ...newTodo,
        todoId,
        userId: getUserId(event),
        createdAt: Date.now().toString(),
        done: false
      }

      await _todo.createTodo(todoItem)

      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          item: todoItem
        })
      }
    } catch (e) {
      logger.info(`Error creating todo`, {error: e.message })
      return {
        statusCode: 502,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          message: e.message
        })
      }
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
  cors({
    credentials: true
  })
)
