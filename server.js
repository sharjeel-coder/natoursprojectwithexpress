const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });
console.log(process.env);

const port = 3000;
app.listen(port, () => {
  console.log(`app runing on port ${port}`);
});
