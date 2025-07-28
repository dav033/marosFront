import React, { memo } from 'react';

interface Props {
  value: string | number;
  type: 'string' | 'number';
}

// Base sin whitespace-nowrap, con break-words y max-w opcional
const BASE = [
  'px-3',
  'py-4',
  'whitespace-normal',     // permite saltos de línea
  'break-words',          // parte palabras largas
  'text-xs',
  'font-medium',
  'text-[#EFEEEA]',
  'max-w-[200px]' 
].join(' ');

function TableCellInner({ value, type }: Props) {
  return (
    <td
      className={`
        ${BASE}
        ${type === 'number' ? 'text-right' : 'text-left'}
      `}
    >
      {value}
    </td>
  );
}

export default memo(TableCellInner) as typeof TableCellInner;
