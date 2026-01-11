export const safeJsonParse = (str: any, fallback: any) => {
    if (str === null || str === undefined) return fallback;
    if (typeof str !== "string") return str;
    try {
        return JSON.parse(str);
    } catch (e) {
        console.warn("safeJsonParse failed:", e, str);
        return fallback;
    }
};

export const makeDefaultAnswerForQuestion = (q: any) => {
    const t = q.answer_type;
    if (t === "checkbox") return [];
    if (t === "multi") return [];
    if (t === "table") return {};
    if (t === "radio_with_text") return { value: "", note: "" };
    return "";
};

export const normalizeOptions = (optionsRaw: any[]) => {
    return (optionsRaw || []).map((opt: any) =>
        typeof opt === "string" ? opt : opt?.value ?? opt?.label ?? String(opt)
    );
};