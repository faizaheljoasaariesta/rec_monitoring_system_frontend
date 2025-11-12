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

const products = [
  { value: "AFM331G5X30", label: "AFM331G5X30" },
  { value: "AFM331G5X31", label: "AFM331G5X31" },
  { value: "AFM331G5X32", label: "AFM331G5X32" },
  { value: "AFM331G5X33", label: "AFM331G5X33" },
  { value: "AFM331G5X34", label: "AFM331G5X34" },
  { value: "AFM331G5X35", label: "AFM331G5X35" },
  { value: "AFM331G5X36", label: "AFM331G5X36" },
  { value: "AFM331GDNTS", label: "AFM331GDNTS" },
  { value: "AFM331N5E40", label: "AFM331N5E40" },
  { value: "AFM531B5125", label: "AFM531B5125" },
  { value: "AFM531B5E20", label: "AFM531B5E20" },
  { value: "AFM531B5E21", label: "AFM531B5E21" },
  { value: "AFM531B5E22", label: "AFM531B5E22" },
  { value: "AFM531B5E23", label: "AFM531B5E23" },
  { value: "AFM531B5E24", label: "AFM531B5E24" },
  { value: "AFM531B5E25", label: "AFM531B5E25" },
  { value: "AFM531B5E26", label: "AFM531B5E26" },
  { value: "AFM531B5E27", label: "AFM531B5E27" },
  { value: "AFM531B5E28", label: "AFM531B5E28" },
  { value: "AFM531D5E20", label: "AFM531D5E20" },
  { value: "AFM531f%E20", label: "AFM531f%E20" },
  { value: "AFM531F%E24", label: "AFM531F%E24" },
  { value: "AFM531F1E40", label: "AFM531F1E40" },
  { value: "AFM531F5E20", label: "AFM531F5E20" },
  { value: "AFM531F5E21", label: "AFM531F5E21" },
  { value: "AFM531F5E22", label: "AFM531F5E22" },
  { value: "AFM531F5E23", label: "AFM531F5E23" },
  { value: "AFM531F5E24", label: "AFM531F5E24" },
  { value: "AFM531F5E26", label: "AFM531F5E26" },
  { value: "AFM531F5E31", label: "AFM531F5E31" },
  { value: "AFM531F5E32", label: "AFM531F5E32" },
  { value: "AFM531F5E33", label: "AFM531F5E33" },
  { value: "AFM531F5F20", label: "AFM531F5F20" },
  { value: "AFM531F5F21", label: "AFM531F5F21" },
  { value: "AFM531F5F22", label: "AFM531F5F22" },
  { value: "AFM531F5F23", label: "AFM531F5F23" },
  { value: "AFM531F5F24", label: "AFM531F5F24" },
  { value: "AFM531F5F25", label: "AFM531F5F25" },
  { value: "AFM531F5F26", label: "AFM531F5F26" },
  { value: "AFM531F5F27", label: "AFM531F5F27" },
  { value: "AFM531GDNTS", label: "AFM531GDNTS" },
  { value: "AFM531V5E32", label: "AFM531V5E32" },
  { value: "AFM531V5E33", label: "AFM531V5E33" },
  { value: "AFM541B5E20", label: "AFM541B5E20" },
  { value: "AFM541B5E21", label: "AFM541B5E21" },
  { value: "AFM541F5GA0", label: "AFM541F5GA0" },
  { value: "AFM541GDNTS", label: "AFM541GDNTS" },
  { value: "AFM624F5P11", label: "AFM624F5P11" },
  { value: "AFM624GDNTS", label: "AFM624GDNTS" },
  { value: "AFM624V5P10", label: "AFM624V5P10" },
  { value: "AFM624V5P20", label: "AFM624V5P20" },
  { value: "AFM817D5P30", label: "AFM817D5P30" },
  { value: "AFM817GDNTS", label: "AFM817GDNTS" },
  { value: "AFM817V5P30", label: "AFM817V5P30" },
  { value: "AFM828V5P10", label: "AFM828V5P10" },
  { value: "RAFM531D5E20", label: "RAFM531D5E20" },
  { value: "RAFM531K5E30", label: "RAFM531K5E30" },
];


export function Combobox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="hidden w-[200px] justify-between @[767px]/card:flex"
        >
          {value
            ? products.find((product) => product.value === value)?.label
            : "All product selected..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search product..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {products.map((product) => (
                <CommandItem
                  key={product.value}
                  value={product.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {product.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === product.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
