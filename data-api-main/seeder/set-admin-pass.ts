import { program } from "commander"

import { setAdminPass } from "./utils"

program
  .option("--directusUrl [url]")
  .requiredOption("--superAdminPass [pass]")
  .requiredOption("--newAdminPass [pass]")
program.parse()
const options = program.opts()

setAdminPass(
  options.directusUrl || "http://localhost:8055",
  options.superAdminPass,
  options.newAdminPass
)
