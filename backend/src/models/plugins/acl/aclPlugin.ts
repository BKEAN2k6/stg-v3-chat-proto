import mongoose, {type HydratedDocument, type Query} from 'mongoose';

type DocumentIdLike = mongoose.Types.ObjectId | string;

type RoleSpecByPath<T> = {userPath: keyof T & string; role: string};
export type RoleAssignment<T> = RoleSpecByPath<T>;

export type AclPluginOptions<T> = {
  parent?: keyof T & string;
  roles?: ReadonlyArray<RoleAssignment<T>>;
};

export type AclRoleMethods = {
  aclSetUserRole(user: DocumentIdLike, role: string): Promise<void>;
  aclRemoveUser(user: DocumentIdLike): Promise<void>;
};

type AclItemCreatePayload = {
  resourceId: string;
  parent?: string;
  roles?: ReadonlyArray<{user: DocumentIdLike; role: string}>;
};

function isObjectId(v: unknown): v is mongoose.Types.ObjectId {
  return (
    typeof (v as mongoose.Types.ObjectId | undefined)?.toHexString ===
    'function'
  );
}

function extractId(value: unknown): string | undefined {
  if (!value) return undefined;
  if (isObjectId(value)) return value.toJSON();
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    const maybeId = (value as {_id?: unknown})._id;
    if (isObjectId(maybeId)) return maybeId.toJSON();
    if (typeof maybeId === 'string') return maybeId;
  }

  return undefined;
}

function getPath<T>(
  document: HydratedDocument<T>,
  key: keyof T & string,
): unknown {
  return (document as unknown as Record<string, unknown>)[key];
}

function buildRoles<T>(
  document: HydratedDocument<T>,
  roles: ReadonlyArray<RoleAssignment<T>> | undefined,
): ReadonlyArray<{user: DocumentIdLike; role: string}> | undefined {
  if (!roles || roles.length === 0) return undefined;
  const out: Array<{user: DocumentIdLike; role: string}> = [];
  for (const r of roles) {
    const raw = getPath(document, r.userPath);
    const id = extractId(raw);
    if (id) out.push({user: id, role: r.role});
  }

  return out.length > 0 ? out : undefined;
}

export function AclTreePlugin<T>(
  schema: mongoose.Schema<T>,
  rawOptions: AclPluginOptions<T>,
) {
  const options: {
    roles?: ReadonlyArray<RoleAssignment<T>>;
    parent?: keyof T & string;
  } = {
    roles: rawOptions.roles,
    parent: rawOptions.parent,
  };

  const watchedPaths = new Set<string>();
  if (options.parent) watchedPaths.add(options.parent);
  for (const r of options.roles ?? []) watchedPaths.add(r.userPath);

  function shouldRecreate<TDocument>(
    document: HydratedDocument<TDocument>,
  ): boolean {
    if (watchedPaths.size === 0) return false;
    for (const p of watchedPaths) {
      if (document.isModified(p)) return true;
    }

    return false;
  }

  async function createAclFor(document: HydratedDocument<T>): Promise<void> {
    const resourceId = extractId(document._id);
    if (!resourceId) throw new Error('AclTreePlugin: resourceId missing');

    const parentRaw = options.parent
      ? getPath(document, options.parent)
      : undefined;
    const parent = extractId(parentRaw);
    const roles = buildRoles(document, options.roles);

    const payload: AclItemCreatePayload = {resourceId};
    if (parent) payload.parent = parent;
    if (roles) payload.roles = roles;

    await mongoose.model('AclItem').deleteOne({resourceId});
    await mongoose.model('AclItem').create(payload);
  }

  async function deleteAclByResourceId(resourceId: unknown): Promise<void> {
    const id = extractId(resourceId);
    if (!id) throw new Error('AclTreePlugin: Query _id is not found.');
    await mongoose.model('AclItem').deleteOne({resourceId: id});
  }

  schema.pre('save', async function () {
    const document = this as HydratedDocument<T>;
    if (document.isNew) {
      await createAclFor(document);
      return;
    }

    if (shouldRecreate(document)) {
      await createAclFor(document);
    }
  });

  schema.post(
    'deleteOne',
    {document: false, query: true},
    async function (this: Query<unknown, T>): Promise<void> {
      const filter = this.getFilter() as unknown;
      const id =
        typeof filter === 'object' && filter !== null
          ? (filter as {_id?: unknown})._id
          : undefined;

      if (!id) {
        throw new Error('Query _id is not found.');
      }

      await deleteAclByResourceId(id);
    },
  );

  schema.method(
    'aclSetUserRole',
    async function (
      this: HydratedDocument<T> & AclRoleMethods,
      user: DocumentIdLike,
      role: string,
    ): Promise<void> {
      const resourceId = extractId(this._id);
      if (!resourceId) throw new Error('AclTreePlugin: resourceId missing');

      await mongoose
        .model('AclItem')
        .updateOne({resourceId} as Record<string, unknown>, {
          $pull: {roles: {user}},
        });

      await mongoose
        .model('AclItem')
        .updateOne({resourceId} as Record<string, unknown>, {
          $addToSet: {roles: {user, role}},
        });
    },
  );

  schema.method(
    'aclRemoveUser',
    async function (
      this: HydratedDocument<T> & AclRoleMethods,
      user: DocumentIdLike,
    ): Promise<void> {
      const resourceId = extractId(this._id);
      if (!resourceId) throw new Error('AclTreePlugin: resourceId missing');

      await mongoose
        .model('AclItem')
        .updateOne({resourceId} as Record<string, unknown>, {
          $pull: {roles: {user}},
        });
    },
  );
}
