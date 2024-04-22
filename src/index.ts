import { SDK } from '@ringcentral/sdk';
import waitFor from 'wait-for-async';

const sdk = new SDK({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});

const client = sdk.client();
client.on(client.events.requestSuccess, (apiResponse) => {
  console.log(apiResponse.headers.get('rcrequestid'), apiResponse.url);
});

const platform = sdk.platform();

const main = async () => {
  await platform.login({
    jwt: process.env.RINGCENTRAL_JWT_TOKEN,
  });
  await platform.get('/restapi/v1.0/account/~/extension/~');
  const auth = platform.auth();
  const tokenInfo = await auth.data();

  // by default access token expires in 3600 seconds
  // we make it expire in 1 second, just for testing purpose.
  tokenInfo.expire_time = undefined;
  tokenInfo.expires_in = '1'; // force token to be expired
  await auth.setData(tokenInfo);

  await waitFor({ interval: 1000 });
  await platform.get('/restapi/v1.0/account/~/extension/~');
};
main();
