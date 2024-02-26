import React from 'react'

const CustomPieChartt = () => {
  return (
    <div>CustomPieChartt</div>
  )
}

export default CustomPieChartt

// import { Tooltip } from '@mui/material';
// import React from 'react'

// // Bibliotecas
// import { Pie, PieChart, ResponsiveContainer } from 'recharts';

// const CustomPieChartt = ({ data }) => {
//   const COLORS = [
//     '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF',
//     '#FF195E', '#19FFB1', '#FF5C19', '#196DFF', '#8A2BE2',
//     '#FF1493', '#00FFFF', '#7FFF00', '#FFD700', '#FFA07A',
//     '#20B2AA', '#FF00FF', '#1E90FF', '#FFFF00'
//   ];

//   return (
//     <ResponsiveContainer width="100%" height={300}>
//       <PieChart>
//         <Tooltip formatter={(value, name, props) => (<><p>Produto: {props.payload.nome}</p> <p>Quantidade: {value}</p></>)} />
//         <Pie
//           data={data}
//           cx="50%"
//           cy="50%"
//           labelLine={false}
//           outerRadius="100%"
//           fill="#8884d8"
//           dataKey="quantidade"
//         >
//           {produtosMaisVendidos.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//           ))}
//         </Pie>
//       </PieChart>
//     </ResponsiveContainer>
//   )
// }

// export default CustomPieChartt