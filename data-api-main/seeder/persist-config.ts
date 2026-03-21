/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TableConfig {
  primaryField?: string
  hasT9n?: boolean
  ignoreOnUpdate?: string[]
  ignoreOnExport?: string[]
  customExportFilter?: any
  sortBy?: string
}

const systemFieldsToIgnoreOnExport = [
  "date_created",
  "user_created",
  "date_updated",
  "user_updated",
]
const systemFieldsIgnoreOnUpdate = [
  "date_created",
  "date_updated",
  "user_created",
  "user_updated",
  "translation",
]

const fileLibraryFoldersToExport = [
  "public",
  "avatars",
  "org_swl_media",
  "user_swl_media",
  "org_cca66e77_swl_media",
  "user_8e37148d_swl_media",
]

// NOTE: the default export filter is:
// persistent: {
//   _eq: true,
// }

export const persistConfigPerTable: { [key: string]: TableConfig } = {
  directus_flows: {
    // NOTE: exports everything
    customExportFilter: {},
    ignoreOnExport: [...systemFieldsToIgnoreOnExport, "operations"],
    ignoreOnUpdate: [...systemFieldsIgnoreOnUpdate],
  },
  directus_operations: {
    ignoreOnExport: [...systemFieldsToIgnoreOnExport],
    ignoreOnUpdate: [...systemFieldsIgnoreOnUpdate],
    // NOTE: exports everything
    customExportFilter: {},
    // since directus_operations has a reference to itself (resolve), we also
    // need to take care that we import data back in the right order. We can use
    // date_created for this, since the children always get created after the
    // parent.
    sortBy: "date_created",
  },
  language: {
    // NOTE: this will get all rows!
    primaryField: "code",
    hasT9n: false,
    ignoreOnUpdate: [],
  },
  strength: {
    customExportFilter: {},
    hasT9n: true,
    ignoreOnExport: [...systemFieldsToIgnoreOnExport, "translation"],
    ignoreOnUpdate: [...systemFieldsIgnoreOnUpdate],
  },
  directus_roles: {
    ignoreOnExport: ["users"],
    // NOTE: this is the default export filter. Just making it explicit here,
    // since it needs to play together with the directus_permissions export
    // filter below
    customExportFilter: {
      persistent: {
        _eq: true,
      },
    },
  },
  // NOTE: the directus_permissions table is the only one of the exported tables
  // where we have numeric IDs to worry about. This can cause conflicting id's
  // in the seed files if two developers have simultaneously added a permission,
  // or for example if permissions are added in production and in development
  // but not synced in between. No clear fix for this available right now, so
  // just be mindful when adding new permissions. This means:
  // 1. When two devs are working with something that relates to permissions at
  //    the same time, the IDs might clash when merging, so we just need to be
  //    aware of that.
  // 2. Permissions should only be added from one environment, and seeded into
  //    others (so no new permissions to be created directly in production
  //    environment for example).
  directus_permissions: {
    ignoreOnExport: [],
    // NOTE: this needs play together with the roles export. Since we use the
    // default for roles (persistent = true), we only export permissions related
    // to those roles that get exported. In addition we export permissions
    // related to the "public" role (where the role = NULL), since the public
    // role always exists.
    customExportFilter: {
      _or: [
        {
          role: {
            persistent: {
              _eq: true,
            },
          },
        },
        {
          role: {
            _null: true,
          },
        },
      ],
    },
  },
  directus_folders: {
    customExportFilter: {
      name: {
        _in: fileLibraryFoldersToExport,
      },
    },
  },
  swl_wall: {
    ignoreOnExport: [
      ...systemFieldsToIgnoreOnExport,
      "swl_item_links",
      "directus_users",
      "group",
    ],
    ignoreOnUpdate: [...systemFieldsIgnoreOnUpdate],
    customExportFilter: {
      id: {
        _in: [
          // organization: crow-valley-school
          "091f592f-4c3f-454e-bf7c-de6567310d29",
          // user: test-org-controller@seethegood.app
          "853b085a-81ce-46a5-b798-3b7f86443c2a",
        ],
      },
    },
  },
  parent_organization: {
    hasT9n: true,
    ignoreOnExport: [
      ...systemFieldsToIgnoreOnExport,
      "translation",
      "organization",
    ],
    ignoreOnUpdate: [...systemFieldsIgnoreOnUpdate],
  },
  organization: {
    hasT9n: true,
    ignoreOnExport: [
      ...systemFieldsToIgnoreOnExport,
      "users",
      "translation",
      // 'swl_wall',
    ],
    ignoreOnUpdate: [...systemFieldsIgnoreOnUpdate],
  },
  directus_users: {
    ignoreOnUpdate: ["external_identifier", "provider", "tfa_secret"],
    ignoreOnExport: [
      "last_access",
      "last_page",
      "password",
      "organizations",
      "groups",
      "onboarding_completed_at",
      "date_created",
      "granted_rewards",
      "credit_count",
      // 'swl_wall',
    ],
  },
  directus_presets: {
    customExportFilter: {
      user: {
        _in: ["a2c1f989-ee4f-48fb-88af-1b320eb2de21"],
      },
    },
  },
  directus_files: {
    ignoreOnUpdate: ["uploaded_by", "uploaded_on"],
    ignoreOnExport: [
      "modified_by",
      "modified_on",
      "uploaded_by",
      "peek_access_token",
      "peek_accessed_at",
    ],
    customExportFilter: {
      _and: [
        {
          folder: {
            name: {
              _in: fileLibraryFoldersToExport,
            },
          },
        },
        {
          storage: {
            _neq: "s3",
          },
        },
      ],
    },
  },
  user_to_organization: {
    ignoreOnExport: [...systemFieldsToIgnoreOnExport, "last_dashboard_access"],
    ignoreOnUpdate: [...systemFieldsIgnoreOnUpdate],
    customExportFilter: {
      user: {
        persistent: {
          _eq: true,
        },
      },
    },
  },
  //
  // For now, don't persist these... (we don't really have any good examples that would make sense in persisting)
  // swl_item: {
  //   ignoreOnExport: [...systemFieldsToIgnoreOnExport, 'files', 'strengths'],
  //   ignoreOnUpdate: [...systemFieldsIgnoreOnUpdate],
  //   customExportFilter: {
  //     swl_wall: {
  //       organization: {
  //         persistent: {
  //           _eq: true,
  //         },
  //       },
  //     },
  //   },
  // },
  // swl_item_strength: {
  //   ignoreOnExport: [...systemFieldsToIgnoreOnExport],
  //   ignoreOnUpdate: [...systemFieldsIgnoreOnUpdate],
  //   customExportFilter: {
  //     swl_item: {
  //       swl_wall: {
  //         organization: {
  //           persistent: {
  //             _eq: true,
  //           },
  //         },
  //       },
  //     },
  //   },
  // },
  strengths_valley_map: {
    hasT9n: true,
    ignoreOnExport: [...systemFieldsToIgnoreOnExport, 'translation', 'strengths_valley_story'], // prettier-ignore
    ignoreOnUpdate: [...systemFieldsIgnoreOnUpdate],
    // NOTE: exports everything
    customExportFilter: {},
  },
  strengths_valley_story: {
    hasT9n: true,
    ignoreOnExport: [...systemFieldsToIgnoreOnExport, 'translation', 'strengths_valley_round'], // prettier-ignore
    ignoreOnUpdate: [...systemFieldsIgnoreOnUpdate],
    // NOTE: exports everything
    customExportFilter: {},
  },
  strengths_valley_round: {
    hasT9n: true,
    ignoreOnExport: [...systemFieldsToIgnoreOnExport, 'translation', 'strengths_valley_level', 'strengths_valley_slide_start', 'strengths_valley_slide_end'], // prettier-ignore
    ignoreOnUpdate: [...systemFieldsIgnoreOnUpdate],
    // NOTE: exports everything
    customExportFilter: {},
  },
  strengths_valley_level: {
    hasT9n: false,
    ignoreOnExport: [...systemFieldsToIgnoreOnExport, 'strengths_valley_slide'], // prettier-ignore
    ignoreOnUpdate: [...systemFieldsIgnoreOnUpdate],
    // NOTE: exports everything
    customExportFilter: {},
  },
  strengths_valley_slide: {
    hasT9n: true,
    ignoreOnExport: [...systemFieldsToIgnoreOnExport, 'translation'], // prettier-ignore
    ignoreOnUpdate: [...systemFieldsIgnoreOnUpdate],
    // NOTE: exports everything
    customExportFilter: {},
  },
  strengths_valley_state: {
    customExportFilter: {
      id: {
        _in: ["02ec3698-24b2-409d-9e7c-c2094e038a0c"],
      },
    },
  },
  reward: {
    ignoreOnExport: [...systemFieldsToIgnoreOnExport], // prettier-ignore
    ignoreOnUpdate: [...systemFieldsIgnoreOnUpdate],
    // NOTE: exports everything
    customExportFilter: {},
  },
}
