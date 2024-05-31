import express from 'express';
import Accountroute from './routes/Account';
import Listroute from './routes/List';
import ItemsRoute from './routes/Items';

const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = 8080;
const app = express()
//backend branch testssss

app.use(cors());
app.use(bodyParser.json());


app.use('/account',Accountroute); //route for owners
app.use('/list',Listroute);//route for list
app.use('/items',ItemsRoute);//route for list
app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});