const express = require('express');
const app = express();
const secret1 = 'projects/1019145220404/secrets/mysql_password/versions/latest'

var body = 'Hello from App Engine!'

// Imports the Secret Manager library
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');

// Instantiates a client
const client = new SecretManagerServiceClient();

function accessSecretVersion(name) {
  const [version] = await client.accessSecretVersion({
    name: name,
  });

  // Extract the payload as a string.
  return version.payload.data.toString();
}


app.get('/', (req, res) => {
  res.send(body.concat(accessSecretVersion(secret1)));
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});