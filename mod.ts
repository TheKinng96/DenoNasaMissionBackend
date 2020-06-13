import { Application } from "https://deno.land/x/oak@v5.0.0/mod.ts";

const app = new Application();
const port = 8000;

app.listen({
  port: PORT,
});
