"use client"

import { useEffect, useState } from "react"
// import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Badge } from "@/components/ui/badge"

interface ProductData {
  travelCard: string
  productNo: string
  serialNo: string
  lastTest: string
  finalResult: "OK" | "NG"
  operator: string
  totalTest: number
  passed: number
}

export function ProductTable({ filterStatus }: { filterStatus: string }) {
  const [data, setData] = useState<ProductData[]>([])

  useEffect(() => {
    // Simulasi fetch data dari API
    const sampleData: ProductData[] = [
      {
        travelCard: "RMR1-25110049-00",
        productNo: "AFM531F5F20",
        serialNo: "2545004901610",
        lastTest: "2025-11-10 11:35:02",
        finalResult: "OK",
        operator: "R000016",
        totalTest: 7,
        passed: 7,
      },
      {
        travelCard: "RMR1-25110052-00",
        productNo: "AFM531F5F24",
        serialNo: "25460052050",
        lastTest: "2025-11-10 15:21:04",
        finalResult: "NG",
        operator: "AS-1",
        totalTest: 7,
        passed: 6,
      },
    ]
    setData(sampleData)
  }, [])

  const filtered =
    filterStatus === "all"
      ? data
      : data.filter((p) => p.finalResult.toLowerCase() === filterStatus)

  return (
    <div className="w-full">
      <div className="rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="p-3">Travel Card</th>
              <th>Product No</th>
              <th>Serial No</th>
              <th>Operator</th>
              <th>Last Test</th>
              <th>Result</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr
                key={item.travelCard}
                className="border-t border-muted hover:bg-muted/20"
              >
                <td className="p-3 font-medium">{item.travelCard}</td>
                <td>{item.productNo}</td>
                <td>{item.serialNo}</td>
                <td>{item.operator}</td>
                <td>{item.lastTest}</td>
                <td>
                  <Badge
                    variant={item.finalResult === "OK" ? "default" : "destructive"}
                  >
                    {item.finalResult}
                  </Badge>
                </td>
                <td>
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="p-4">
                      <DrawerHeader>
                        <DrawerTitle>
                          Product Detail — {item.travelCard}
                        </DrawerTitle>
                      </DrawerHeader>
                      <div className="space-y-3 p-4">
                        <p>
                          <b>Product No:</b> {item.productNo}
                        </p>
                        <p>
                          <b>Serial No:</b> {item.serialNo}
                        </p>
                        <p>
                          <b>Operator:</b> {item.operator}
                        </p>
                        <p>
                          <b>Total Test:</b> {item.totalTest}
                        </p>
                        <p>
                          <b>Passed:</b> {item.passed}
                        </p>
                        <p>
                          <b>Result:</b> {item.finalResult}
                        </p>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
