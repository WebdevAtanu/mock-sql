import { useState } from 'react';

interface OutputQueryProps {
    sql: string;
}

export default function OutputQuery({ sql }: OutputQueryProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(sql);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
    };

    const downloadFile = () => {
        const blob = new Blob([sql], { type: 'text/sql' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dummy-data.sql';
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!sql) return null;

    return (
        <div className="rounded h-full border border-slate-300 bg-white p-4 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.2)]">

            {/* Actions */}
            <div className="mb-4 flex justify-between items-center gap-2">
                <span className="text-xs text-slate-500">
                    SQL Preview
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={copyToClipboard}
                        className="rounded bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
                    >
                        {copied ? 'Copied' : 'Copy'}
                    </button>

                    <button
                        onClick={downloadFile}
                        className="rounded bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                    >
                        Download
                    </button>
                </div>
            </div>

            {/* Code Block */}
            <pre className="max-h-90 overflow-auto rounded bg-slate-50 p-4 text-sm leading-6 text-slate-900 border border-slate-200">
                {sql}
            </pre>
        </div>
    );
}