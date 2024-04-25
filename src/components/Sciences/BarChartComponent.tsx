// Tipagem
import { graphicData } from '../../models/types'

// Biblioteca
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, YAxis } from 'recharts'
import { useRecoilValue } from 'recoil'

// Dados
import { vibrantPalette } from '../../data/PaletteData'

// Atom
import { filterDescription } from '../../atom/filterAtom'

// Componente
import renderTooltipContent from './ToolTipComponente/ToolTip'

const BarChartComponent = ({ data }: graphicData) => {
  const palette = useRecoilValue(filterDescription)

  const total = data.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <ResponsiveContainer width="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <Tooltip cursor={false} content={renderTooltipContent} />
        <YAxis fill='text-gray-600' allowDataOverflow={true} className='font-bold text-[12px]' />
        <Bar dataKey="value">
          {
            palette.length > 0 ? (
              palette.map((item, index) => (
                <Cell
                  key={index}
                  fill={item.id !== undefined ? vibrantPalette[item.id] : vibrantPalette[index % vibrantPalette.length]}
                />
              ))
            ) : (
              data.map((_, index) => (
                <Cell
                  key={index}
                  fill={vibrantPalette[index % vibrantPalette.length]}
                />
              ))
            )
          }
          <LabelList
            dataKey="value"
            content={({ value, x, y }) => {
              if (typeof value !== 'undefined') {
                const numericValue = Number(value);
                if (!isNaN(numericValue) && total !== 0) {
                  const rate = `${((numericValue / total) * 100).toFixed(2)}%`;
                  const yOffset = typeof y === 'number' ? y + 3 : 0;
                  const xOffset = typeof x === 'number' ? x + 25 : 0;

                  return (
                    <text
                      x={xOffset}
                      y={yOffset}
                      dy={-10}
                      textAnchor="middle"
                      fill="text-gray-600"
                      className="font-bold text-[12px]"
                    >
                      {rate}
                    </text>
                  );
                }
              }
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default BarChartComponent