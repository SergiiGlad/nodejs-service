const express = require('express');
const metadata = require('gcp-metadata');
const {OAuth2Client} = require('google-auth-library');

const app = express();
const oAuth2Client = new OAuth2Client();

const secret1 = 'projects/427943077440/secrets/controller-app-db-username-dev/versions/latest'

// Imports the Secret Manager library
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');

// Instantiates a client
const client = new SecretManagerServiceClient();

async function accessSecretVersion(name) {
  const [version] = await client.accessSecretVersion({
    name: name,
  });

  // Extract the payload as a string.
  const payload = version.payload.data.toString();

  // WARNING: Do not print the secret in a production environment - this
  // snippet is showing how to access the secret material.
  console.info(`Payload: ${payload}`);

  return "string";
}

const iapJwt  = ''

const expectedAudience = '/projects/427943077440/apps/teck-dev-haulcycle1-mckinsey';

async function verify() {
  // Verify the id_token, and access the claims.
  const response = await oAuth2Client.getIapPublicKeys();
  const ticket = await oAuth2Client.verifySignedJwtWithCertsAsync(
    iapJwt,
    response.pubkeys,
    expectedAudience,
    ['https://cloud.google.com/iap']
  );
  // Print out the info contained in the IAP ID token
  console.log(ticket);
}

verify().catch(console.error);
app.get('/', async (req, res) => {
  res.send(req);
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});