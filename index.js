const app = require('./app');
const { port } = require('./config');

app.listen(port, (err) => {
  if (err) {
    process.exit(1);
  } else {
    console.log(`Express server listening on ${port}`);
  }
});
