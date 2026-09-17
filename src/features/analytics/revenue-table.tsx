import type { MonthlyPoint } from '@/data/analytics'

/**
 * The chart's accessible representation: the real figures, as a table.
 *
 * Deliberately kept out of the lazily loaded chart module. A screen reader
 * jumping straight to this section must find the data whether or not the
 * ECharts bundle has arrived yet.
 */
export function RevenueTable({ data, label }: { data: MonthlyPoint[]; label: string }) {
  return (
    <figcaption className="sr-only">
      <table>
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Revenue (IDR millions)</th>
            <th scope="col">Cost of goods (IDR millions)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((point) => (
            <tr key={point.month}>
              <th scope="row">{point.month}</th>
              <td>{point.revenue}</td>
              <td>{point.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figcaption>
  )
}
