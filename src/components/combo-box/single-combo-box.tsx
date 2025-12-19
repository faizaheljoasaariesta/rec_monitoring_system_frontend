"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface ComboBoxItem {
  value: string
  label: string
}

interface MachineComboBoxProps {
  items: ComboBoxItem[]
  value?: string
  placeholder?: string
  loading?: boolean
  onChange?: (value: string) => void
}

export function SingleComboBox({
  items,
  value: externalValue,
  placeholder = "Select Machine...",
  loading = false,
  onChange,
}: MachineComboBoxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(externalValue ?? "")

  React.useEffect(() => {
    if (externalValue !== undefined) setValue(externalValue)
  }, [externalValue])

  const dynamicPlaceholder = loading
    ? "Loading..."
    : placeholder

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue
    setValue(newValue)
    onChange?.(newValue)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[200px] justify-between"
          disabled={loading}
        >
          {value
            ? items.find((i) => i.value === value)?.label
            : dynamicPlaceholder}

          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search machine..." />
          <CommandList>
            {loading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : items.length === 0 ? (
              <CommandEmpty>No machine found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => handleSelect(item.value)}
                  >
                    {item.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
