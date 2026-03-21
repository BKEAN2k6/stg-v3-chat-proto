export const avatarSlugs = [
  'humppa',
  'inarijarvi',
  'kaldoaivi',
  'karmiini',
  'keekutti',
  'kevo',
  'kilpisjarvi',
  'korintti',
  'lemmenjoki',
  'levi',
  'mconni',
  'melikes',
  'nuorgam',
  'pallas',
  'peloton',
  'pikkunaakka',
  'pomppo',
  'pyha',
  'repovesi',
  'teijo',
  'tilulilu',
  'urho',
  'utsjoki',
  'wadus',
  // 'yllas',
];

export const avatarColors = [
  '#d7ebd6',
  '#d0cbdc',
  '#ffe88a',
  '#4d97b5',
  '#f3a275',
  '#fceae0',
  '#ddeedf',
  '#61c4b4',
  '#acd5b1',
  '#fce3e2',
  '#b0e1d9',
  '#3ab5a1',
  '#9da5b2',
  '#eb524c',
  '#ef7570',
  '#8eafdc',
  '#ef7f40',
  '#f9ccb3',
  '#9bc5d5',
  '#feecb9',
  '#a5d7d5',
  '#f8c9cd',
  '#fdd662',
  '#aba2c1',
  // '#97cb9d',
  // '#fdc626',
];

export const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const formatName = (createdBy: {
  firstName: string;
  lastName: string;
}) => {
  const firstName = capitalize(createdBy.firstName);
  const lastName = capitalize(createdBy.lastName);
  return `${firstName} ${lastName}`;
};

export const formatShortName = (createdBy: {
  firstName: string;
  lastName: string;
}) => {
  const firstName = capitalize(createdBy.firstName);
  const lastNameFirstLetter = createdBy.lastName.charAt(0).toUpperCase();
  return `${firstName} ${lastNameFirstLetter}`;
};

export const colorFromId = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash += id.codePointAt(i) ?? 0;
  }

  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
};
