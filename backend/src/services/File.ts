import Xws from "../helpers/Xws"
import { v4 as uuidv4 } from "uuid"
import { createLogger } from '../utils/logger'

const logger = createLogger("fileAccess")

export default class FileService {

    public static createAttachmentPresignedUrl(fileName) {

        logger.info("Creating Attachment Presigned Url")

        let url, myBucket, imgName

        try {
            const s3 = new Xws.S3({ signatureVersion: 'v4' })
            const signedUrlExpireSeconds = process.env?.SIGNED_URL_EXPIRATION || 60 * 5
            
            myBucket = process.env.ATTACHMENT_S3_BUCKET
            imgName = `${uuidv4()}-${fileName}`

            url = s3.getSignedUrl('putObject', {
                Bucket: myBucket,
                Key: imgName,
                Expires: Number(signedUrlExpireSeconds),
                ACL: 'public-read'
            })
        } catch (e) {
            logger.info("Error while creating presigned url", { error: e.message })
            throw new Error(e.message)
        }

        return {
            signedUrl: url,
            image: `https://${myBucket}.s3.amazonaws.com/${imgName}`
        }
    }
}