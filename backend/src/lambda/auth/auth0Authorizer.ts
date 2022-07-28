import { APIGatewayTokenAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode, Algorithm, JwtHeader } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { JwtPayload } from '../../auth/JwtPayload'
import * as jwksRsa from "jwks-rsa";

const logger = createLogger('auth')

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
  return
}

async function getKey(header: JwtHeader) {
  const jwksClient = jwksRsa({ jwksUri: process.env.AUTH_JWKS_URL })
  const key: any = await jwksClient.getSigningKey(header.kid)
  return key?.publicKey ?? key?.rsaPublicKey
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)

  if (!token)
    throw new Error("Token not provided")
  
  const { header } = decode(token, { complete: true });
  const secrete = await getKey(header)

  return verify(token, secrete as string, { algorithms: [header.alg as Algorithm] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
