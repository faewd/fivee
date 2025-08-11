import { express } from "$deps";
import db from "$db/database.ts";
import { Spell } from "$collections/spells/collection.ts";
import { render, RenderConfig } from "$snippets/renderer.ts";
import { pluralize } from "$snippets/helpers.ts";
import puppeteer from "npm:puppeteer";

const router = express.Router();

async function renderSpellCard(req: express.Request, res: express.Response): Promise<string | null> {
  const spellId = req.params.spellId;
  const cssMode = req.query.cssMode as RenderConfig["cssMode"] | undefined;
  const theme = req.query.theme as RenderConfig["theme"] | undefined;
  const expressions = (req.query.expressions as RenderConfig["expressions"]) ??
    "html";

  const data = await db.get<Spell>("spells", spellId);
  if (data === null) {
    res.status(404);
    res.send(`Couldn't find a spell with the id '${spellId}'.`);
    return null;
  }

  // deno-lint-ignore no-explicit-any
  const spell: any = data;

  spell.isCantrip = data.level === 0;
  spell.isLevelled = data.level > 0;

  spell.castingTime = data.castingTimes
    .map((ct) => {
      return `${ct.amount} ${ct.amount != 1 ? pluralize(ct.unit) : ct.unit}`;
    })
    .join(" or ");

  spell.range = ((range) => {
    switch (range.kind) {
      case "point":
        return `${range.distance} ${
          pluralize(
            range.unit,
            range.distance != 1,
          )
        }`;
      case "self":
        if (!range.shape) return `Self`;
        return `${range.shape.size.distance} ${range.shape.size.unit} ${range.shape.kind}`;
      case "touch":
      case "special":
      case "sight":
      case "unlimited":
        return range.kind[0].toUpperCase() + range.kind.slice(1);
    }
  })(data.range);

  spell.duration = data.durations
    .map((d) => {
      switch (d.kind) {
        case "instantaneous":
        case "special":
          return d.kind[0].toUpperCase() + d.kind.slice(1);
        case "permanent":
          if (!d.until) return "Permanent";
          return `Until ${d.until}`;
        case "time": {
          let duration = "";
          if (d.concentration) duration += "Concentration, up to ";
          duration += `${d.amount} ${pluralize(d.unit, d.amount != 1)}`;
          if (d.until) duration += ` or until ${d.until}`;
          return duration;
        }
      }
    })
    .join("; or ");

  spell.materials = data.materials?.desc;

  return render("spellCard", { spell }, { cssMode, theme, expressions })
}

router.get("/:spellId.png", async (req: express.Request, res: express.Response) => {
  const html = await renderSpellCard(req, res)
  if (html === null) return;
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setContent(html)
  const article = await page.$("article")
  if (article === null) {
    res.status(500)
    res.send("Something went wrong while rendering the snippet.")
    return ;
  }
  const imageBuffer = await article.screenshot()
  await page.close()
  await browser.close()
  
  res.set("Content-Type", "image/png")
  res.send(imageBuffer)
})

router.get("/:spellId", async (req: express.Request, res: express.Response) => {
  const html = await renderSpellCard(req, res)
  if (html === null) return;
  res.status(200);
  res.send(html);
});

export default router;
