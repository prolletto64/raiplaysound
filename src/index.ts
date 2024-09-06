import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = 4000;

app.get("/", (req: Request, res: Response) => {
  res.statusCode = 400;
  res.send("Request [podcast name].xml");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
