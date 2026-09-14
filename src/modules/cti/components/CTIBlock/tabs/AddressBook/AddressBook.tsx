import { CTIList, type CTIListProps } from "../CTIList";
import { useAddressBook } from "./useAddressBook";

type Props = Pick<CTIListProps, "onSelect">;

export const AddressBook = (props: Props) => {
  const entries = useAddressBook();

  const rows = entries.map(({ name, value }) => [name, "", value] as const);

  return (
    <CTIList {...props} title="Адресная книга" rows={rows} showCopyAction />
  );
};
