const express = require('express');
const app = express();
const secret1 = 'projects/1019145220404/secrets/mysql_password/versions/latest'

var body = 'Hello from App Engine!'

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

  return payload;
}


app.get('/', (req, res) => {
  res.send(`${accessSecretVersion(secret1)}`);
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});