import React, { memo } from 'react';

interface Props {
  value: string | number;
  type: 'string' | 'number';
  className?: string;
}

function TableCellInner({ value, type, className = '' }: Props) {
  return (
    <td
      className={`
        px-3 py-3
        text-sm
        text-theme-light
        whitespace-normal break-words
        h-auto
        ${type === 'number' ? 'text-right' : 'text-left'}
        ${className}
      `}
    >
      <div className="whitespace-normal break-words">
        {value}
      </div>
    </td>
  );
}

export default memo(TableCellInner) as typeof TableCellInner;
