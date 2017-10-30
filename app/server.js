// import express
import express from 'express';
import bodyParser from 'body-parser';
import * as config from '../config/config.js'; // import config
import routes from './routes';

const app = express(); // new server

// parse body params
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);

// start app on PORT
app.listen(config.PORT, () => console.log(`Started server on ${config.PORT}`));
