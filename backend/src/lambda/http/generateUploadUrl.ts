import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import FileService from '../../services/File'
import Todo from '../../models/Todo'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger("SigningUrl")

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Begining s3 signing")

    try {
      const { fileName } = JSON.parse(event.body || '{}')
      
      logger.info(`Got fileName for s3 signing, ${fileName}`)

      if (!fileName) throw new Error("fileName is required.")

      const _todo = new Todo()
      const userId = getUserId(event)
      const todoId = event.pathParameters?.todoId
      const { signedUrl, image } = FileService.createAttachmentPresignedUrl(fileName)

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
      logger.info("Error s3 signing", { error: e.message })
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
