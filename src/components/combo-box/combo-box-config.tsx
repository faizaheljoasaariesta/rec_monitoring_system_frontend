import { MachineComboBox, type ComboboxItem } from "@/components/combo-box/machine-combo-box";

interface MachineComboboxProps {
  appSource: string;
  value: string;
  onChange: (v: string) => void;
}

const machineMapping: Record<string, string[]> = {
  RG_AA_IOT: ["2", "3", "4", "5", "7", "8", "9", "10", "11"],
  RG_AIQT_IOT: ["1", "2", "3"],
  RG_BIQT_IOT: ["1", "2", "3"],
};

export function ComboBoxConfig({
  appSource,
  value,
  onChange,
}: MachineComboboxProps) {
  const items: ComboboxItem[] = (machineMapping[appSource] ?? []).map((m) => ({
    value: m,
    label: `Machine ${m}`,
  }));

  return (
    <MachineComboBox
      items={items}
      value={value}
      placeholder="Select Machine..."
      onChange={onChange}
    />
  );
}
