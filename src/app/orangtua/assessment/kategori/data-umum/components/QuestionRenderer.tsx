"use client";

import React from "react";
import { FolderPlus, Plus, Trash } from "lucide-react";
import { safeJsonParse } from "../utils/helpers";

interface QuestionRendererProps {
    question: any;
    answer: any;
    onAnswerChange: (qid: any, value: any) => void;
    onToggleCheckbox: (qid: any, value: any) => void;
    onTableCellChange: (qid: any, label: string, value: any) => void;
}

export default function QuestionRenderer({
    question: q,
    answer,
    onAnswerChange,
    onToggleCheckbox,
    onTableCellChange,
}: QuestionRendererProps) {
    const extra = safeJsonParse(q.extra_schema, {});
    const optionsRaw = Array.isArray(extra?.options)
        ? extra.options
        : safeJsonParse(q.answer_options, []);

    // normalize options to string values
    const options = (optionsRaw || []).map((opt: any) =>
        typeof opt === "string" ? opt : opt?.value ?? opt?.label ?? String(opt)
    );

    return (
        <div>
            <label className="block font-medium text-gray-700 mb-1 text-xs md:text-sm">
                {q.question_number ? `${q.question_number}. ` : ""}
                {q.question_text}
            </label>

            {/* TEXT */}
            {q.answer_type === "text" && (
                <TextQuestion value={answer} onChange={(v) => onAnswerChange(q.id, v)} />
            )}

            {/* NUMBER */}
            {q.answer_type === "number" && (
                <NumberQuestion value={answer} onChange={(v) => onAnswerChange(q.id, v)} />
            )}

            {/* TEXTAREA */}
            {q.answer_type === "textarea" && (
                <TextareaQuestion value={answer} onChange={(v) => onAnswerChange(q.id, v)} />
            )}

            {/* SELECT */}
            {q.answer_type === "select" && (
                <SelectQuestion
                    value={answer}
                    options={options}
                    onChange={(v) => onAnswerChange(q.id, v)}
                />
            )}

            {/* RADIO */}
            {q.answer_type === "radio" && (
                <RadioQuestion
                    qid={q.id}
                    value={answer}
                    options={options}
                    onChange={(v) => onAnswerChange(q.id, v)}
                />
            )}

            {/* CHECKBOX */}
            {q.answer_type === "checkbox" && (
                <CheckboxQuestion
                    value={answer}
                    options={options}
                    onToggle={(v) => onToggleCheckbox(q.id, v)}
                />
            )}

            {/* RADIO WITH TEXT */}
            {q.answer_type === "radio_with_text" && (
                <RadioWithTextQuestion
                    qid={q.id}
                    value={answer}
                    options={options}
                    onChange={(v) => onAnswerChange(q.id, v)}
                />
            )}

            {/* MULTI */}
            {q.answer_type === "multi" && (
                <MultiQuestion
                    value={answer}
                    fields={extra?.fields || ["Nama", "Usia"]}
                    onChange={(v) => onAnswerChange(q.id, v)}
                />
            )}

            {/* TABLE */}
            {q.answer_type === "table" && (
                <TableQuestion
                    qid={q.id}
                    value={answer}
                    rows={extra?.rows || []}
                    onCellChange={onTableCellChange}
                />
            )}
        </div>
    );
}

// ==================== SUB COMPONENTS ====================

function TextQuestion({ value, onChange }: { value: any; onChange: (v: string) => void }) {
    return (
        <input
            className="border rounded-md p-2 w-full text-xs md:text-sm"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}

function NumberQuestion({ value, onChange }: { value: any; onChange: (v: string) => void }) {
    return (
        <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="border rounded-md p-2 w-full sm:w-32 text-xs md:text-sm"
            value={value ?? ""}
            onChange={(e) => {
                const v = e.target.value;
                if (/^\d*$/.test(v)) {
                    onChange(v);
                }
            }}
        />
    );
}

function TextareaQuestion({ value, onChange }: { value: any; onChange: (v: string) => void }) {
    return (
        <textarea
            rows={3}
            className="border rounded-md p-2 w-full text-xs md:text-sm"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}

function SelectQuestion({
    value,
    options,
    onChange,
}: {
    value: any;
    options: string[];
    onChange: (v: string) => void;
}) {
    return (
        <select
            className="border rounded-md p-2 text-xs md:text-sm w-full sm:w-auto"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">Pilih salah satu</option>
            {options.map((opt, idx) => (
                <option key={idx} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
    );
}

function RadioQuestion({
    qid,
    value,
    options,
    onChange,
}: {
    qid: any;
    value: any;
    options: string[];
    onChange: (v: string) => void;
}) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-2">
            {options.map((opt, idx) => (
                <label key={idx} className="flex items-center gap-2 text-xs md:text-sm">
                    <input
                        type="radio"
                        name={`radio-${qid}`}
                        value={opt}
                        checked={value === opt}
                        onChange={(e) => onChange(e.target.value)}
                        className="accent-[#409E86]"
                    />
                    {opt}
                </label>
            ))}
        </div>
    );
}

function CheckboxQuestion({
    value,
    options,
    onToggle,
}: {
    value: any;
    options: string[];
    onToggle: (v: string) => void;
}) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-2">
            {options.map((opt, idx) => (
                <label key={idx} className="flex items-center gap-2 text-xs md:text-sm">
                    <input
                        type="checkbox"
                        checked={Array.isArray(value) && value.includes(opt)}
                        onChange={() => onToggle(opt)}
                        className="accent-[#409E86]"
                    />
                    {opt}
                </label>
            ))}
        </div>
    );
}

function RadioWithTextQuestion({
    qid,
    value,
    options,
    onChange,
}: {
    qid: any;
    value: any;
    options: string[];
    onChange: (v: any) => void;
}) {
    return (
        <div className="mt-2 space-y-3">
            {options.map((opt, idx) => (
                <label key={idx} className="flex items-center gap-2 text-xs md:text-sm">
                    <input
                        type="radio"
                        name={`radio-${qid}`}
                        value={opt}
                        checked={value?.value === opt}
                        onChange={() => onChange({ value: opt, note: "" })}
                        className="accent-[#409E86]"
                    />
                    {opt}
                </label>
            ))}

            {(value?.value === "Tidak" ||
                value?.value === "Belum Imunisasi" ||
                value?.value === "Tidak Lengkap") && (
                    <input
                        className="border rounded-md p-2 w-full text-xs md:text-sm"
                        value={value?.note ?? ""}
                        onChange={(e) => onChange({ ...(value || {}), note: e.target.value })}
                        placeholder="Keterangan"
                    />
                )}
        </div>
    );
}

function MultiQuestion({
    value,
    fields,
    onChange,
}: {
    value: any;
    fields: string[];
    onChange: (v: any[]) => void;
}) {
    const rows = Array.isArray(value) ? value : [];

    const addRow = () => {
        const newRow: any = {};
        fields.forEach((f) => {
            newRow[f] = "";
        });
        onChange([...rows, newRow]);
    };

    const updateRow = (index: number, field: string, val: string) => {
        const updated = [...rows];
        updated[index] = { ...updated[index], [field]: val };
        onChange(updated);
    };

    const removeRow = (index: number) => {
        onChange(rows.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3 mt-2">
            {rows.map((row: any, index: number) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    {fields.map((f) => (
                        <input
                            key={f}
                            className="border p-2 rounded-md text-xs md:text-sm w-full sm:w-auto"
                            value={row[f] || ""}
                            onChange={(e) => updateRow(index, f, e.target.value)}
                            placeholder={f}
                        />
                    ))}

                    <div className="flex gap-2">
                        {index === rows.length - 1 && (
                            <button type="button" className="text-[#6BB1A0] p-2" onClick={addRow}>
                                <FolderPlus size={18} className="text-blue-500" />
                            </button>
                        )}

                        {index > 0 && (
                            <button type="button" className="text-red-500 p-2" onClick={() => removeRow(index)}>
                                <Trash size={18} />
                            </button>
                        )}
                    </div>
                </div>
            ))}

            {rows.length === 0 && (
                <button
                    type="button"
                    className="text-[#6BB1A0] flex items-center gap-2 text-xs md:text-sm"
                    onClick={addRow}
                >
                    <Plus size={18} /> Tambah
                </button>
            )}
        </div>
    );
}

function TableQuestion({
    qid,
    value,
    rows,
    onCellChange,
}: {
    qid: any;
    value: any;
    rows: string[];
    onCellChange: (qid: any, label: string, value: any) => void;
}) {
    if (!Array.isArray(rows) || rows.length === 0) {
        return <p className="text-xs md:text-sm">Tidak ada baris.</p>;
    }

    return (
        <div className="mt-2 space-y-2 overflow-x-auto">
            <div className="min-w-max">
                {rows.map((label, idx) => (
                    <div key={idx} className="flex items-center gap-4 mb-2">
                        <span className="w-32 sm:w-48 text-xs md:text-sm">{label}</span>
                        <input
                            className="border p-2 rounded-md w-24 sm:w-32 text-xs md:text-sm"
                            value={(value && value[label]) ?? ""}
                            onChange={(e) => onCellChange(qid, label, e.target.value)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}