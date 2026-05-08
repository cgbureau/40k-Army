import { runSeedCollections } from "@db_index/";

export const seedDb = async () => {
  const summary = await runSeedCollections({
    mode: "dry_run",
    resetBeforeSeed: false,
    collection: "reference_data",
  });

  console.log(summary);
};
