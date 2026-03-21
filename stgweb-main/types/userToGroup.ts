export type UserToGroup = {
  id: string;
  user: string;
  group: string | {id: string; swl_wall: string};
};
