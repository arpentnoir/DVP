import * as cors from "cors";
import * as express from 'express';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/healthcheck', (req, res) => {
  res.send("OK");
});

export { app };
