import { z } from "zod";

/** Matches Prisma `AccessType` — shared by unit and detachment faction access fields. */
export const accessTypeSchema = z.enum(["shared", "inherited", "exclusive"]);
