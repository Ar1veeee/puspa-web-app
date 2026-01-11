export const useAnswers = (answers: Record<string, any>, setAnswers: Function) => {
    const setAnswer = (qid: any, value: any) => {
        setAnswers((prev: any) => ({ ...prev, [qid]: value }));
    };

    const toggleCheckboxValue = (qid: any, val: any) => {
        setAnswers((prev: any) => {
            const arr = Array.isArray(prev[qid]) ? prev[qid] : [];
            return {
                ...prev,
                [qid]: arr.includes(val)
                    ? arr.filter((v: any) => v !== val)
                    : [...arr, val],
            };
        });
    };

    const handleTableCell = (qid: any, label: string, value: any) => {
        setAnswers((prev: any) => {
            const prevTable = (prev[qid] && typeof prev[qid] === "object") ? prev[qid] : {};
            return { ...prev, [qid]: { ...prevTable, [label]: value } };
        });
    };

    return { setAnswer, toggleCheckboxValue, handleTableCell };
};