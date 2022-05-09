import { router } from "../components/router";
import { PublicError } from "../components/sentry";

export function init() {
  router.get("/", async (ctx) => {
    ctx.render("index.pug", {
      title: "Home | CardaWorlds",
    });
  });

  router.get("/explorer", async (ctx) => {
    ctx.render("explorer.pug", {
      title: "Explorer | CardaWorlds",
    });
  });

  router.get("/faq", async (ctx) => {
    ctx.render("faq.pug", {
      title: "FAQ | CardaWorlds",
    });
  });

  router.get("/roadmap", async (ctx) => {
    ctx.render("roadmap.pug", {
      title: "Roadmap | CardaWorlds",
    });
  });

  router.get("/humans.txt", async (ctx) => {
    ctx.body = "Made by Zachary Montgomery for CardaWorlds.";
  });
}
