// components/shared/Table/ReusableTable.tsx
import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ReusableTableProps<TRow> {
  th: string[]
  rows: TRow[]
  getRowKey: (row: TRow) => string
  renderCell: (header: string, row: TRow) => React.ReactNode
  getRowClassName?: (row: TRow) => string
}

export default function ReusableTable<TRow>({
  th,
  rows,
  getRowKey,
  renderCell,
  getRowClassName,
}: ReusableTableProps<TRow>) {
  return (
    <div className="shadow-sm mt-3">
      <Table>
        <TableHeader>
          <TableRow className='bg-gray-100 '>
            {th.map((item) => (
              <TableHead className='text-gray-600 text-[17px] text-right py-3 px-4' key={item}>{item}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={getRowKey(row)} className={getRowClassName?.(row)}>
              {th.map((header) => (
                <TableCell className="pr-3" key={header}>{renderCell(header, row)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}