const fs = require("fs")
const path = require("path")

const factionsDir = path.join(__dirname, "../../data/factions")

let totalUnits = 0
let totalPriced = 0
let factionCount = 0

const factions = fs.readdirSync(factionsDir)

factions.forEach(faction => {

  const unitsPath = path.join(factionsDir, faction, "units.json")

  if (!fs.existsSync(unitsPath)) return

  const data = JSON.parse(fs.readFileSync(unitsPath, "utf8"))

  const units = data.units || []

  factionCount++

  units.forEach(unit => {
    totalUnits++

    if (unit.prices && Object.values(unit.prices).some(v => v > 0)) {
      totalPriced++
    }
  })

})

const coverage = ((totalPriced / totalUnits) * 100).toFixed(1)

console.log("\n40KARMY DATASET STATS\n")

console.log("Factions:", factionCount)
console.log("Units:", totalUnits)
console.log("Units with price:", totalPriced)
console.log("Coverage:", coverage + "%")

console.log("\nCurrencies supported:")
console.log("GBP, USD, EUR, AUD, CAD")

console.log("\nRetail kit dataset: ~359 kits\n")