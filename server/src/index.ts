import * as env from 'env-var';
import express from 'express';

const PORT = env.get('SERVER_PORT').required().asPortNumber();

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
