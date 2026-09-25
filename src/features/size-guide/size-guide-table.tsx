import { sizeGuide } from '@/data/size-guide';

export function SizeGuideTable() {
  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-x-auto rounded-card border border-line">
        <table className="w-full min-w-[520px] text-left text-sm">
          <caption className="sr-only">Medidas por talla en centímetros</caption>
          <thead className="bg-surface font-display text-[0.65rem] tracking-[0.16em] text-gold uppercase">
            <tr>
              <th scope="col" className="px-4 py-3">
                Talla
              </th>
              <th scope="col" className="px-4 py-3">
                Pecho / busto
              </th>
              <th scope="col" className="px-4 py-3">
                Cintura
              </th>
              <th scope="col" className="px-4 py-3">
                Cadera
              </th>
              <th scope="col" className="px-4 py-3">
                Largo
              </th>
            </tr>
          </thead>
          <tbody>
            {sizeGuide.map((row) => (
              <tr key={row.size} className="border-t border-line text-fg-muted">
                <th scope="row" className="px-4 py-3 font-display font-bold text-fg">
                  {row.size}{' '}
                  <span className="font-sans font-normal text-fg-subtle">({row.label})</span>
                </th>
                <td className="px-4 py-3">{row.chestCm} cm</td>
                <td className="px-4 py-3">{row.waistCm} cm</td>
                <td className="px-4 py-3">{row.hipCm} cm</td>
                <td className="px-4 py-3">{row.lengthCm} cm</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="grid gap-3 text-sm text-fg-muted sm:grid-cols-2">
        <li className="rounded-card border border-line p-4">
          <strong className="text-gold">KA ELITE (compresión):</strong> ajuste ceñido. Si prefieres
          algo más relajado, elige una talla más.
        </li>
        <li className="rounded-card border border-line p-4">
          <strong className="text-gold">Resiliencia (algodón 100%):</strong> patrón oversize con
          caída estructurada.
        </li>
      </ul>
    </div>
  );
}
