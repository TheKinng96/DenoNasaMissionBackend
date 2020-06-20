import { join, BufReader, parse, log, pick } from "../deps.ts";


type Planet = Record<string, string>;

let planets = Array<Planet>();

export function filterHabitablePlanets(planets: Array<Planet>) {
  return planets.filter((planet) => {
    const planetaryRadius = Number(planet["koi_prad"]);
    const stellarMass = Number(planet["koi_smass"]);
    const stellarRadius = Number(planet["koi_srad"]);

    return planet["koi_disposition"] === "CONFIRMED" &&
      planetaryRadius > 0.5 && planetaryRadius < 1.5 &&
      stellarMass > 0.78 && stellarMass < 1.04 &&
      stellarRadius > 0.99 && stellarRadius < 1.01;
  });
}

async function loadPlanetData() {
  const path = join("data", "original.csv");

  const data = await Deno.open(path);
  const bufReader = new BufReader(data);
  const result = await parse(bufReader, {
    header: true,
    comment: "#",
  });
  Deno.close(data.rid);

  const planets = filterHabitablePlanets(result as Array<Planet>);

  return planets.map((planet) => {
    return pick(planet, [
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
log.info(`${planets.length} habitable planets found!`);

export function getAllPlanets() {
  return planets;
}
