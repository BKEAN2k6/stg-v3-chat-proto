/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/*
SEED IN:
- read TableConfig to get the import order and metadata (keys are the tables we are importing data for)
- read the data to import from persisted/[table_name].json
- for each:
  - find an existing record by the same id
  - if exists, run update for all fields
  - if not found, run insert

SEED OUT:
- read TableConfig to get the import order and metadata (keys are the tables we are importing data for)
- get the full structure of the rows to be persisted as JSON and store to persisted/[table_name].json
- whenever there's a _t9n associated, we should be able to automatically get that also if hasT9n is set to true

NOTE: This file is using a lot of "any" types, since this was hacked together quickly.
NOTE: We need to ignore "one-to-many" relation fields (field is not actually in the db)
NOTE: We need to be sure to insert stuff in the right order if there are relationships between the data (parents first, then children)
*/
import fs from "fs"

import { Directus } from "@directus/sdk"
import { program } from "commander"
import { diff } from "deep-diff"

import { persistConfigPerTable } from "./persist-config"
import type { TableConfig } from "./persist-config"
import { setAdminPass } from "./utils"

program
  .option("-i, --in")
  .option("-o, --out")
  .option("--directusUrl [url]")
  .option("--superAdminPass [pass]")
  .option("--newAdminPass [pass]")
program.parse()
const options = program.opts()

const persistedFilesFolder = "seeder/persisted"

const removeObjectProperties = (obj: any, propertiesToRemove: any[]) => {
  const clone = { ...obj }
  propertiesToRemove.forEach((propertyToRemove: any) => {
    delete clone[propertyToRemove]
  })
  return clone
}

// The logic for pulling data from the database (directusOut) to files in seed/persisted/[table_name].json
const databaseToFile = async (
  directus: any,
  tableName: string,
  tableConfig: TableConfig,
  filter: any
) => {
  const primaryField = tableConfig.primaryField || "id"
  const sortBy = tableConfig.sortBy || primaryField
  const ignoreOnExport = tableConfig.ignoreOnExport || []
  const query = await directus.items(tableName).readByQuery({
    filter,
    sort: [`${sortBy}`],
    limit: -1,
  })
  const persistedRowsFile = `${persistedFilesFolder}/${tableName}.json`
  const rowsToExport = query.data.map((_row: any) => {
    const row = removeObjectProperties(_row, [...ignoreOnExport])
    // sorts object keys so that diffs works
    return Object.fromEntries(Object.entries(row).sort())
  })
  fs.writeFileSync(persistedRowsFile, JSON.stringify(rowsToExport, null, 2))
  return query.data
}

// The logic for reading files in seed/persisted and storing the contents to the database (directusIn)
const fileToDatabase = async (
  directus: any,
  tableName: string,
  tableConfig: TableConfig
) => {
  const ignoreOnUpdate = tableConfig.ignoreOnUpdate || []
  const ignoreOnExport = tableConfig.ignoreOnExport || []
  const primaryField = tableConfig.primaryField || "id"
  // const tableRows = queryPersistentRows.data as any
  const persistedRowsFile = `${persistedFilesFolder}/${tableName}.json`
  if (!fs.existsSync(persistedRowsFile)) {
    throw new Error(`could not find ${persistedRowsFile}`)
  }
  const tableRowsRaw = fs.readFileSync(persistedRowsFile, "utf-8")
  const tableRows = JSON.parse(tableRowsRaw)
  const idsToCheck = tableRows.map((row: any) => row[primaryField])
  let query = { data: null }
  if (idsToCheck.length > 0) {
    query = await directus.items(tableName).readMany(idsToCheck, {
      limit: -1,
    })
  }
  let existingItems = [] as any
  let existingIds = [] as any
  if (query.data) {
    existingItems = query.data
    // A query to directus_permissions returns bunch of data that isn't really
    // stored in the database. Those rows are returned without an ID, so just get
    // rid of them here.
    if (tableName === "directus_permissions") {
      existingItems = existingItems.filter((item: any) => item.id)
    }
  }
  if (existingItems.length > 0) {
    existingIds = existingItems.map(
      (existingRow: any) => existingRow[primaryField]
    )
  }
  const idsToInsert = idsToCheck.filter((el: any) => !existingIds.includes(el))
  // collect items to work with based on ids to add or update
  const itemsToInsert = tableRows.filter((row: any) => {
    return idsToInsert.includes(row[primaryField])
  })
  const itemsToMaybeUpdate = tableRows.filter((rows: any) => {
    return existingIds.includes(rows[primaryField])
  })
  // diff items to update to make sure we don't unnessarily update rows that have not changed
  const itemsToUpdate = [] as any
  for (let idx = 0; idx < existingItems.length; idx += 1) {
    // always ignore updates on primary field in addition to others defined per table
    const ignoreFields = [...ignoreOnUpdate, ...ignoreOnExport, primaryField]
    const existingItem = existingItems[idx]
    const updatableItem = itemsToMaybeUpdate.find(
      (item: any) => item[primaryField] === existingItem[primaryField]
    )
    const o1 = removeObjectProperties(existingItem, ignoreFields)
    const o2 = removeObjectProperties(updatableItem, ignoreFields)
    // deep diff between o1 and o2 to see if there are any changes
    const changes = diff(o1, o2)
    // if (tableName == 'language') {
    //   console.log('changes', changes)
    //   console.log('o1', o1)
    //   console.log('o2', o2)
    // }
    if (changes) {
      // restore primary field after all the diffing is done
      o2[primaryField] = existingItems[idx][primaryField]
      itemsToUpdate.push(o2)
    }
  }
  // return
  // RUN UPDATES
  for (let idx = 0; idx < itemsToUpdate.length; idx += 1) {
    const itemToUpdate = itemsToUpdate[idx]
    const itemToUpdateId = itemsToUpdate[idx][primaryField]
    await directus.items(tableName).updateOne(itemToUpdateId, itemToUpdate)
  }
  // RUN INSERTS
  if (itemsToInsert.length > 0) {
    if (tableName === "directus_files") {
      // The directus_files table seems to have some issues with "createMany"
      // (fails with "type is required"), so insert items one by one since that
      // seems to work just fine...
      for (let idx = 0; idx < itemsToInsert.length; idx += 1) {
        const itemToInsert = itemsToInsert[idx]
        const itemToInsertId = itemsToInsert[idx][primaryField]
        await directus.items("directus_files").createOne(itemToInsert)
        // and an extra update still against the inserted data, since createOne above changes the "updated_by" field value...
        await directus
          .items("directus_files")
          .updateOne(itemToInsertId, itemToInsert)
      }
    } else {
      // This is the regular insert case that works for everything but directus_files
      await directus.items(tableName).createMany(itemsToInsert)
    }
  }
  //
  console.log(
    `inserted: ${itemsToInsert.length}, updated ${itemsToUpdate.length}\n`
  )
}

const waitForDirectus = async (directus: any, url: string) => {
  console.log(`waiting for a valid response from directus at ${url}`)
  const tryToConnect = async () => {
    try {
      const ping = await directus.server.ping()
      if (ping === "pong") {
        return true
      }
    } catch (err) {
      console.log((err as Error).message)
      return false
    }
  }
  for (let idx = 0; idx <= 5; idx += 1) {
    const connected = await tryToConnect()
    if (connected) {
      console.error(`connected to directus at ${url}`)
      return true
    }
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }
  console.error(`could not connect to directus at ${url}`)
  throw new Error("connection failed")
}

// the runner function doing seeding in our out based on persistConfigPerTable
export const run = async () => {
  if (options.in && options.out) {
    throw new Error("cant do both at the same time")
  }

  // connect to directus
  const directusUrl = options.directusUrl || "http://localhost:8055"
  const directus = new Directus(directusUrl)
  await waitForDirectus(directus, directusUrl)

  // auth with directus
  await directus.auth.login({
    email: "superadmin@positive.fi",
    password: options.superAdminPass || "local-superadmin-pass1",
  })

  const tablesToPersist = Object.keys(persistConfigPerTable)
  // Useful for debugging imports / exports of just one table...
  // const tablesToPersist = ['directus_permissions']
  // const tablesToPersist = ['directus_files']

  if (options.in) {
    console.log("-- seed in start --\n")
    // go through each table in order they are listed in persistConfigPerTable
    for (let idx = 0; idx < tablesToPersist.length; idx += 1) {
      const tableName = tablesToPersist[idx] || ""
      const tableConfig = tableName && persistConfigPerTable[tableName]
      if (tableConfig) {
        console.log(`table: ${tableName}`)
        // handle the reqular table
        await fileToDatabase(directus, tableName, tableConfig)
        // handle translation table if there should be one for the table
        if (tableConfig.hasT9n) {
          const t9nTableName = `${tableName}_t9n`
          console.log(`table: ${t9nTableName}`)
          await fileToDatabase(directus, t9nTableName, {})
        }
      }
    }
    // bit hacky here, but Directus doesn't allow us to export passwords, so we need to manually set it to all the users we import...
    // this only matters for localhost, since other environments have their own passwords set when they are initially set up
    if (directusUrl === "http://localhost:8055") {
      await directus
        .items("directus_users")
        .updateOne("8e37148d-369d-41c6-a716-ae074b6235c5", {
          password: "testadmin",
        })
    }
    // if we are importing seeds, we might want to also set the admin pass
    if (options.superAdminPass && options.newAdminPass) {
      setAdminPass(directusUrl, options.superAdminPass, options.newAdminPass)
    }
  }
  if (options.out) {
    console.log("-- seed out start --\n")
    // go through each table in order they are listed in persistConfigPerTable
    for (let idx = 0; idx < tablesToPersist.length; idx += 1) {
      const tableName = tablesToPersist[idx] || ""
      const tableConfig = tableName && persistConfigPerTable[tableName]
      if (tableConfig) {
        console.log("persist", tableName)
        // find rows in the table with the "persist" field set to true
        const rows = await databaseToFile(
          directus,
          tableName,
          tableConfig,
          tableConfig.customExportFilter || {
            persistent: {
              _eq: true,
            },
          }
        )
        if (tableConfig.hasT9n && rows) {
          const t9nTableName = `${tableName}_t9n`
          // go through each of the translation rows related to the persisted
          // data fetched above, and store them as well
          const allTranslations = rows.flatMap((row: any) => row.translation)
          if (allTranslations.length > 0) {
            console.log("persist", t9nTableName)
            await databaseToFile(
              directus,
              t9nTableName,
              {},
              {
                id: { _in: allTranslations },
              }
            )
          }
        }
      }
    }
  }
}

run()
