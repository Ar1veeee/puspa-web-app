import { useState, useEffect } from "react";
import { getParentAssessmentQuestions } from "@/lib/api/asesmentTerapiOrtu";
import { makeDefaultAnswerForQuestion } from "../utils/helpers";

export const useAssessmentData = () => {
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [answers, setAnswers] = useState<Record<string, any>>({});

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            setLoading(true);
            try {
                const resp: any = await getParentAssessmentQuestions("parent_general");

                const list =
                    Array.isArray(resp?.data?.groups) ? resp.data.groups :
                        Array.isArray(resp?.groups) ? resp.groups :
                            Array.isArray(resp?.data) ? resp.data : [];

                const hasIdentitas = list.some((g: any) => g.group_key === "identitas");
                if (!hasIdentitas) {
                    list.unshift({
                        group_key: "identitas",
                        title: "Identitas Anak & Orangtua",
                        questions: []
                    });
                }

                if (!mounted) return;
                setGroups(list);

                const init: Record<string, any> = {};
                list.forEach((g: any) => {
                    (g.questions || []).forEach((q: any) => {
                        init[q.id] = makeDefaultAnswerForQuestion(q);
                    });
                });

                if (mounted) setAnswers(init);
            } catch (e) {
                console.error("failed:", e);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false };
    }, []);

    return { groups, loading, answers, setAnswers };
};