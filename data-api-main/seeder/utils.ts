/* eslint-disable no-console */
import { Directus } from "@directus/sdk"

export const setAdminPass = async (
  directusUrl: string,
  superAdminPass: string,
  newAdminPass: string
) => {
  const directus = new Directus(directusUrl)

  await directus.auth.login({
    email: "superadmin@positive.fi",
    password: superAdminPass,
  })

  await directus
    .items("directus_users")
    .updateOne("a2c1f989-ee4f-48fb-88af-1b320eb2de21", {
      password: newAdminPass,
    })

  console.log("new admin pass set")
}
