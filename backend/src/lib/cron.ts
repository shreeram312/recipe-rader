import cron from "cron";
import https from "https";
import { ENV } from "./env";

const job = new cron.CronJob("*/14 * * * *", function () {
  https.get(ENV.API_URL, (res) => {
    if (res.statusCode === 200) {
      console.log("GET request to API successful");
    } else {
      console.log("GET request to API failed");
    }
  });
});

job.start();

export default job;
