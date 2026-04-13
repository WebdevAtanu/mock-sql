import type { ColumnFormProps, ColumnType } from '../types';

const COLUMN_TYPES: ColumnType[] = [
    'INT',
    'DECIMAL',
    'VARCHAR',
    'DATE',
    'BOOLEAN',
    'UUID',
    'EMAIL',
    'ADDRESS',
    'PHONE',
];

export default function Form({
    column,
    index,
    updateColumn,
    removeColumn,
}: ColumnFormProps) {
    return (
        <tr className="border-b border-slate-100">

            {/* Column Name */}
            <td className="p-1">
                <input
                    type="text"
                    placeholder="Enter column name"
                    value={column.name}
                    onChange={(e) => updateColumn(index, 'name', e.target.value)}
                    className="w-full rounded border border-slate-200 px-2 py-1 text-sm outline-gray-400"
                />
            </td>

            {/* Type */}
            <td className="p-1">
                <select
                    value={column.type}
                    onChange={(e) => updateColumn(index, 'type', e.target.value)}
                    className="w-full rounded border border-slate-200 px-2 py-1 text-sm"
                >
                    {COLUMN_TYPES.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </td>

            {/* Action */}
            <td className="p-2 text-center">
                <button
                    onClick={() => removeColumn(index)}
                    className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 hover:border-red-300"
                >
                    ✕ Remove
                </button>
            </td>

        </tr>
    );
}