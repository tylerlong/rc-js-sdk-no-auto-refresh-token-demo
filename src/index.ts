import { SDK } from '@ringcentral/sdk';
import waitFor from 'wait-for-async';

const sdk = new SDK({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});

// we print all the HTTP requests
const client = sdk.client();
client.on(client.events.requestSuccess, (apiResponse) => {
  console.log(apiResponse.headers.get('rcrequestid'), apiResponse.url);
});

const platform = sdk.platform();

const main = async () => {
  await platform.login({
    jwt: process.env.RINGCENTRAL_JWT_TOKEN,
    access_token_ttl: 600,
  });

  // disable token auto refresh
  platform.ensureLoggedIn = async () => null;

  await platform.get('/restapi/v1.0/account/~/extension/~');

  // we can manage the token ourselves in our own way
  setInterval(async () => {
    await platform.refresh();
  }, 1800000);

  // wait for 2 hours
  await waitFor({ interval: 7200000 });
  await platform.get('/restapi/v1.0/account/~/extension/~');
};
main();
