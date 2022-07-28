import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import FileService from '../../services/File'
import Todo from '../../models/Todo'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    try {
      const { fileName } = JSON.parse(event.body || '{}')

      const _todo = new Todo()
      const userId = getUserId(event)
      const todoId = event.pathParameters?.todoId
      const { signedUrl, image } = FileService.createAttachmentPresignedUrl(fileName || "")

      await _todo.updateTodoAttachmentUrl(todoId, image, userId)

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ uploadUrl: signedUrl })
      }
    } catch (e) {
      return {
        statusCode: 502,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ message: e.message })
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
