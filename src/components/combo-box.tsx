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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxItem {
  value: string
  label: string
}

interface ComboboxProps {
  items: ComboboxItem[]
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
  loading?: boolean
}

export function Combobox({
  items,
  value: externalValue,
  placeholder = "All selected product...",
  onChange,
  loading = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(externalValue ?? "")

  React.useEffect(() => {
    const storedProduct = localStorage.getItem("product")
    if (storedProduct) {
      setValue(storedProduct)
      onChange?.(storedProduct)
    }
  }, [])

  React.useEffect(() => {
    if (externalValue !== undefined) setValue(externalValue)
  }, [externalValue])

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue
    setValue(newValue)
    onChange?.(newValue)
    localStorage.setItem("product", newValue)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="hidden w-[200px] justify-between @[767px]/card:flex"
          disabled={loading}
        >
          {loading
            ? "Loading..."
            : value
            ? items.find((item) => item.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            {loading ? (
              <CommandEmpty>Loading items...</CommandEmpty>
            ) : items.length === 0 ? (
              <CommandEmpty>No items found.</CommandEmpty>
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
