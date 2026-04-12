import type { ColumnFormProps, ColumnType } from '../types';

const COLUMN_TYPES: ColumnType[] = ['INT', 'DECIMAL', 'VARCHAR', 'DATE', 'BOOLEAN', 'UUID', 'EMAIL', 'PHONE']; // column types to display in the dropdown menu in the form 

export default function Form({ column, index, updateColumn, removeColumn }: ColumnFormProps) {
    return (
        <div className="flex flex-col gap-4 rounded border border-slate-200 bg-white p-2 shadow-sm md:flex-row md:items-start md:justify-between">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 flex-1">
                {/* Column Name */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
                        Column name
                    </label>
                    <input
                        type="text"
                        placeholder="Enter column name"
                        value={column.name}
                        onChange={(e) => updateColumn(index, 'name', e.target.value)}
                        className="w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                    />
                </div>

                {/* Type */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
                        Type
                    </label>
                    <select
                        value={column.type}
                        onChange={(e) => updateColumn(index, 'type', e.target.value)}
                        className="w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                    >
                        {COLUMN_TYPES.map((options) => (
                            <option key={options} value={options}>
                                {options}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Remove Button */}
            <button
                onClick={() => removeColumn(index)}
                className="self-start rounded border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
                ✕
            </button>
        </div>
    );
}