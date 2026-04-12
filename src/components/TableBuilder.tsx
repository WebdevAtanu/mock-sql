import { useMemo, useState } from 'react';
import Form from './Form';
import { generateSQL } from '../utils/dataGenerator';
import OutputQuery from './OutputQuery';
import type { Column } from '../types';

export default function TableBuilder() {
    const [tableName, setTableName] = useState('users');
    const [columns, setColumns] = useState<Column[]>([{ name: 'Id', type: 'INT' }]);
    const [rowCount, setRowCount] = useState(10);
    const [sql, setSQL] = useState('');
    const [createTableSql, setCreateTableSql] = useState('');
    const [parseError, setParseError] = useState('');

    const addColumn = () => {
        setColumns((current) => [...current, { name: '', type: 'VARCHAR' }]);
    };

    const updateColumn = (index: number, field: keyof Column, value: string) => {
        setColumns((current) => {
            const updated = [...current];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const removeColumn = (index: number) => {
        setColumns((current) => current.filter((_, i) => i !== index));
    };

    const parseCreateTable = (sql: string): { tableName: string; columns: Column[] } => {
        const createTableRegex = /CREATE\s+TABLE\s+([\[\]\w\.]+)\s*\(([\s\S]*)\)/i;

        const match = sql.match(createTableRegex);
        if (!match) throw new Error('Invalid CREATE TABLE statement.');

        const tableName = match[1].replace(/[\[\]]/g, '');
        const columnsStr = match[2];

        const columnLines = columnsStr
            .split(/\r?\n/)
            .map(s => s.trim().replace(/,$/, '')) // remove trailing comma
            .filter(s =>
                s &&
                !s.toLowerCase().includes('primary key') &&
                !s.toLowerCase().includes('constraint')
            );

        const columns: Column[] = [];

        for (const line of columnLines) {
            const parts = line.split(/\s+/);

            if (parts.length >= 2) {
                const name = parts[0].replace(/[\[\]"]/g, '');

                let type: Column['type'];

                const baseType = parts[1].toUpperCase().split('(')[0];

                switch (baseType) {
                    case 'INT':
                    case 'BIGINT':
                    case 'SMALLINT':
                    case 'TINYINT':
                        type = 'INT';
                        break;

                    case 'DECIMAL':
                    case 'NUMERIC':
                    case 'FLOAT':
                    case 'REAL':
                    case 'MONEY':
                    case 'SMALLMONEY':
                        type = 'DECIMAL';
                        break;

                    case 'VARCHAR':
                    case 'NVARCHAR':
                    case 'CHAR':
                    case 'NCHAR':
                    case 'TEXT':
                    case 'NTEXT':
                        type = 'VARCHAR';
                        break;

                    case 'DATE':
                    case 'DATETIME':
                    case 'DATETIME2':
                    case 'SMALLDATETIME':
                    case 'TIME':
                        type = 'DATE';
                        break;

                    case 'BIT':
                        type = 'BOOLEAN';
                        break;

                    case 'UNIQUEIDENTIFIER':
                        type = 'UUID';
                        break;

                    default:
                        type = 'VARCHAR';
                }

                columns.push({ name, type });
            }
        }

        return { tableName, columns };
    };

    const handleCreateTableChange = (value: string) => {
        setCreateTableSql(value);
        if (value.trim()) {
            try {
                const parsed = parseCreateTable(value);
                setTableName(parsed.tableName);
                setColumns(parsed.columns);
                setParseError('');
            } catch (error) {
                setParseError((error as Error).message);
            }
        } else {
            setParseError('');
        }
    };

    const canGenerate = useMemo(
        () =>
            tableName.trim().length > 0 &&
            rowCount > 0 &&
            columns.every((column) => column.name.trim().length > 0),
        [columns, rowCount, tableName]
    );

    const handleGenerate = () => {
        const result = generateSQL(tableName.trim(), columns, rowCount);
        setSQL(result);
    };

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto max-w-6xl px-4 py-6">
                <section className="rounded border border-slate-200 bg-white/95 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.15)]">

                    {/* Header */}
                    <div className="flex flex-col gap-2 bg-slate-900 border-b border-slate-200 px-6 py-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">SQL Query Generator</h1>
                            <p className="mt-1 max-w-2xl text-sm text-slate-400">
                                Build dummy data and export a SQL insert script in seconds.
                            </p>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="grid gap-5 p-6 md:grid-cols-2">

                        {/* LEFT */}
                        <div className="space-y-4 border border-slate-300 p-4">

                            {/* CREATE TABLE Input */}
                            <div>
                                <label className="block text-xs mb-1 text-slate-500">
                                    Paste CREATE TABLE statement (optional)
                                </label>
                                <textarea
                                    value={createTableSql}
                                    onChange={(e) => handleCreateTableChange(e.target.value)}
                                    placeholder="CREATE TABLE users (id INT, name VARCHAR(255), email VARCHAR(255));"
                                    className="w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 h-20 resize-none"
                                />
                                {parseError && (
                                    <p className="text-xs text-red-500 mt-1">{parseError}</p>
                                )}
                            </div>

                            {/* Top Controls */}
                            <div className="flex items-end gap-3">

                                {/* Table Name */}
                                <div className="flex-1">
                                    <label className="block text-xs mb-1 text-slate-500">
                                        Table name
                                    </label>
                                    <input
                                        type="text"
                                        value={tableName}
                                        onChange={(e) => setTableName(e.target.value)}
                                        className="w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                    />
                                </div>

                                {/* Rows */}
                                <div className="w-24">
                                    <label className="block text-xs mb-1 text-slate-500">
                                        Rows
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={rowCount}
                                        onChange={(e) =>
                                            setRowCount(Math.max(1, Number(e.target.value) || 1))
                                        }
                                        className="w-full rounded border border-slate-200 bg-slate-50 px-2 py-2 text-sm text-slate-900 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                    />
                                </div>

                                {/* Add Column */}
                                <button
                                    onClick={addColumn}
                                    className="h-10 rounded bg-sky-600 px-3 text-sm text-white transition hover:bg-sky-700"
                                >
                                    + Column
                                </button>
                            </div>

                            {/* Columns */}
                            <div className="max-h-50 overflow-y-auto rounded border border-slate-200 bg-slate-50 p-2">
                                <table className="w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-slate-600">
                                            <th className="p-1 text-left uppercase text-xs">Column Name</th>
                                            <th className="p-1 text-left uppercase text-xs">Type</th>
                                            <th className="p-1 text-left uppercase text-xs">Remove</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {columns.map((col, index) => (
                                            <Form
                                                key={index}
                                                column={col}
                                                index={index}
                                                updateColumn={updateColumn}
                                                removeColumn={removeColumn}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Generate */}
                            <button
                                disabled={!canGenerate}
                                onClick={handleGenerate}
                                className="w-full rounded bg-green-500 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50"
                            >
                                Generate SQL
                            </button>

                            {!canGenerate && (
                                <p className="text-xs text-red-500">
                                    Fill all fields to generate SQL
                                </p>
                            )}
                        </div>

                        {/* RIGHT */}
                        <div className="flex flex-col">
                            {sql ? (
                                <OutputQuery sql={sql} />
                            ) : (
                                <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-400">
                                    Generated SQL will appear here
                                </div>
                            )}
                        </div>

                    </div>
                </section>
            </div>
        </main>
    );
}