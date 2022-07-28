// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it

const apiId = '1xyp2k839a'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

// export const apiEndpoint = `http://localhost:3000/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  domain: 'dev-lyp5jpsa.us.auth0.com',            // Auth0 domain
  clientId: '0xHYESRZbYtcbOP4pDhNPJnyDb2tnGwD', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
