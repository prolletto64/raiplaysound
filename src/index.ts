import { spawnSync } from "child_process";
import express, { Express, Request, Response } from "express";
import RateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";

const app: Express = express();
const port = 4000;

const limiter = RateLimit({
    windowMs: 20 * 60 * 1000,
    max: 100,
  });

if(!fs.existsSync("podcasts")){
    fs.mkdirSync("podcasts");
}

app.use(limiter);

app.get("/*.xml",(req:Request,res:Response)=>{
    let sent=false;
    let filename=fs.realpathSync(path.join("podcasts", req.path));
    if (!filename.startsWith(path.resolve("./","podcasts"))) {
        res.statusCode = 403;
        res.send("bad path exploit");
        return;
      }
    if(fs.existsSync(filename)){
        const diffMillis=Math.abs(new Date().getTime() - fs.statSync(filename).mtime.getTime())
        const diffMins=Math.floor(diffMillis/(1000*60))
        if(diffMins<=15){
            res.send(fs.readFileSync(filename).toString());
            sent=true;
        }
    }
    if(!sent){
        const pythonprocess = spawnSync("python", ["single.py","https://www.raiplaysound.it/programmi"+req.path.slice(0,-4),"-f","podcasts","--film","--programma","--dateok"]);
        if(fs.existsSync(filename)){
         res.send(fs.readFileSync(filename).toString());
         sent=true;
        }
    }
    if(!sent){
        const pythonprocess = spawnSync("python", ["single.py","https://www.raiplaysound.it/playlist"+req.path.slice(0,-4),"-f","podcasts","--film","--programma","--dateok"]);
        if(fs.existsSync(filename)){
         res.send(fs.readFileSync(filename).toString());
         sent=true;
        }
    }
    if(!sent){
        res.statusCode=400;
        res.send("requested podcast doesn't seem to exist on raiplaysound...");
    }
});

app.get("/", (req: Request, res: Response) => {
  res.statusCode = 400;
  res.send("Request [podcast name].xml");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
