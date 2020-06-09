import localforage from 'localforage';

export const memberStore = localforage.createInstance({
  name: 'members',
  description: 'Member address book',
});

export async function getMembersFromDB() {
  const members = [];
  await memberStore.iterate((value) => {
    members.push(value);
  });
  return members;
}

export function membersClear(params) {
  memberStore.clear();
}

export const getMembersCount = memberStore.length;
