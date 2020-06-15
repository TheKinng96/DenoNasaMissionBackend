import { join } from "http://deno.land/std/path/mod.ts";
import { BufReader } from "http://deno.land/std/io/bufio.ts";
import { parse } from "http://deno.land/std/encoding/csv.ts";

import * as _ from "https://deno.land/x/lodash@4.17.15-es/lodash.js";

type Planet = Record<string, string>;

let planets = Array<Planet>();

async function loadPlanetData() {
  const path = join("data", "original.csv");

  const data = await Deno.open(path);
  const bufReader = new BufReader(data);
  const result = await parse(bufReader, {
    header: true,
    comment: "#",
  });
  Deno.close(data.rid);

  const planets = (result as Array<Planet>).filter((planet) => {
    const planetaryRadius = Number(planet["koi_prad"]);
    const stellarMass = Number(planet["koi_smass"]);
    const stellarRadius = Number(planet["koi_srad"]);

    return planet["koi_disposition"] === "CONFIRMED" &&
      planetaryRadius > 0.5 && planetaryRadius < 1.5 &&
      stellarMass > 0.78 && stellarMass < 1.04 &&
      stellarRadius > 0.99 && stellarRadius < 1.01;
  });

  return planets.map((planet) => {
    return _.pick(planet, [
      "koi_prad",
      "koi_smass",
      "koi_srad",
      "kepler_name",
      "koi_count",
      "koi_teq",
      "koi_period",
    ]);
  });
}

planets = await loadPlanetData();
console.log(`${planets.length} habitable planets found!`);

export function getAllPlanets() {
  return planets;
}
