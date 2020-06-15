import { assertEquals,assertNotEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test("short test example", () => {
  assertEquals("deno","deno");
  assertNotEquals({
    runtime: "deno",
  },{
    runtime: "node",
  })
})

Deno.test({
  name: "example testing",
  ignore: Deno.build.os === "windows",
   fn() {
    assertEquals("deno","deno");
    assertNotEquals({
      runtime: "deno",
    },{
      runtime: "node",
    })
   }
});

Deno.test({
  name: "ops leak",
  sanitizeOps: false,
   fn() {
    setTimeout(console.log, 10000);
   },
});

Deno.test({
  name: "resource leak",
  sanitizeResources: false,
  async fn() {
    await Deno.open("./models/planets.ts");
   },
});