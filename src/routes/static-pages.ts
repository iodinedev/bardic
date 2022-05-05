import { router } from "../components/router";
import { PublicError } from "../components/sentry";

export function init() {
  router.get("/", async (ctx) => {
    ctx.render("index.pug", {
      title: "Home | CardaWorlds"
    });
  });

  router.get("/humans.txt", async (ctx) => {
    ctx.body = "Made by Zachary Montgomery for CardaWorlds.";
  });
}
