import { z } from "zod";
import { JsonSchema } from "../seed_config/types/seed-util-types";

export const countrySchema = z.object({
  cca2: z.string().length(2),
  cca3: z.string().length(3),
  ccn3: z.string().length(3).nullable(),
  name_common: z.string(),
  name_official: z.string(),
  name_native: JsonSchema.nullable(),
  un_member: z.boolean(),
  region: z.string(),
  subregion: z.string().nullable(),
  continents: z.string().array(),
  tld: z.string().array(),
  timezones: z.string().array(),
  flag: JsonSchema,
  population: z.int(),
  currencies: JsonSchema,
  languages: JsonSchema,
  car: JsonSchema,
  postal_code: JsonSchema.nullable(),
  latlng: z.float64().array(),
  government: JsonSchema.nullable(),
  gdp: JsonSchema.nullable(),
  hdi: z.number().nullable(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
});
