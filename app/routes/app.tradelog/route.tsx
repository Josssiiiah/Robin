import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Link } from "@remix-run/react";

// I'm gonna have to process that openingOrder date string into a more readable format

export default function Route() {
  const data = [
    {
      symbol: "QQQ",
      openingOrder: "03-10-24",
      optionType: "put",
      expirationDate: "03-20-24",
      strikePrice: "438.00",
      quantity: 1,
      openPrice: 1.69,
      closePrice: 2.16,
      pnl: 47,
      result: "Win",
      closeDate: "03-19-24",
      tradeId: "12345",
    },
    {
      symbol: "SPY",
      openingOrder: "03-11-24",
      optionType: "call",
      expirationDate: "03-15-24",
      strikePrice: "510.00",
      quantity: 2,
      openPrice: 0.6,
      closePrice: 0.68,
      pnl: 16,
      result: "Win",
      closeDate: "03-15-24",
      tradeId: "12346",
    },
    {
      symbol: "QQQ",
      openingOrder: "03-12-24",
      optionType: "call",
      expirationDate: "03-14-24",
      strikePrice: "441.00",
      quantity: 2,
      openPrice: 0.86,
      closePrice: 0.6,
      pnl: -22,
      result: "Loss",
      closeDate: "03-14-24",
      tradeId: "12347",
    },
    {
      symbol: "TSLA",
      openingOrder: "03-13-24",
      optionType: "call",
      expirationDate: "03-15-24",
      strikePrice: "180.00",
      quantity: 1,
      openPrice: 0.84,
      closePrice: 0.8,
      pnl: -4,
      result: "Loss",
      closeDate: "03-1-24",
      tradeId: "12348",
    },
  ];

  const columns = useMemo(
    () => [
      { header: "Open Date", accessorKey: "openingOrder" },
      { header: "Symbol", accessorKey: "symbol" },
      { header: "Result", accessorKey: "result" },
      { header: "Close Date", accessorKey: "closeDate" },
      { header: "Open Price", accessorKey: "openPrice" },
      { header: "Close Price", accessorKey: "closePrice" },
      { header: "Quantity", accessorKey: "quantity" },
      { header: "P/L", accessorKey: "pnl" },
      { header: "Type", accessorKey: "optionType" },
      { header: "Strike Price", accessorKey: "strikePrice" },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="flex flex-col items-center p-10 h-screen">
      <h1 className="font-bold text-4xl pb-12"> Trade Log</h1>
      <div className="flex px-24">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="text-lg" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : (header.column.columnDef.header as React.ReactNode)}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="text-center" key={cell.id}>
                    <Link to={`/app/trades/${row.original.tradeId}`}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Link>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
