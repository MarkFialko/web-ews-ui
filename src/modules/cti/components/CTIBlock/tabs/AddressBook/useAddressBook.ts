const callDirectory = [
  ["Друг", "", "869185003"],
  ["HR", "", "869185004"],
  ["МегаЦУКС", "", "869185007"],
  ["СП Служба архива", "", "869185008"],
  ["Эксперт", "", "44159"],
];

export interface AddressBookEntry {
  name: string;
  value: string;
}

export function useAddressBook(): AddressBookEntry[] {
  return callDirectory.map((entry) => ({
    name: entry[0],
    value: entry[2],
  }));
}
