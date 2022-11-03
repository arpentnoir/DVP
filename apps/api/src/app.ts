import * as cors from "cors";
import * as express from 'express';
import { router } from "./app/router";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/healthcheck', (req, res) => {
  res.send("OK");
});

app.use('/api', router);

export { app };
