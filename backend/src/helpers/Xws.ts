import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk-core'

const XAWS = () => AWSXRay.captureAWS(AWS)

const isLocal = false

export default isLocal ? AWS : XAWS()
