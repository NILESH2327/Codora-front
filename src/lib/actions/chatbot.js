import { postJSON } from "../../api";

export const getBotResponse = async (input) => {
    const lower = input.toLowerCase();

    // if (language === "ml") {
    //     if (lower.includes("നെല്ല്") || lower.includes("rice")) {
    //         return "നെല്ല് കൃഷിക്ക് കേരളത്തിലെ കാലാവസ്ഥ അനുകൂലമാണ്. മൺസൂൺ സമയത്ത് നടീൽ നടത്തുക, ജൈവ വളപ്രയോഗം നടത്തുക.";
    //     }
    //     return "കൂടുതൽ വിവരങ്ങൾ ആവശ്യമാണ്. ദയവായി വ്യക്തമാക്കിയിട്ട് ചോദിക്കുക.";
    // }

    // if (lower.includes("rice") || lower.includes("paddy")) {
    //     return "Rice grows best in monsoon. Maintain water control and use resistant varieties.";
    // }

    // if (lower.includes("coconut")) {
    //     return "Coconut palms need regular watering and neem-based pest control.";
    // }

    // if (lower.includes("pepper")) {
    //     return "Black pepper requires good drainage and organic compost.";
    // }

    // if (lower.includes("weather") || lower.includes("rain")) {
    //     return "Kerala receives heavy monsoon rainfall. Ensure proper drainage.";
    // }

    const res = await postJSON('/advisory/generate', { farmerId: "691f1d24a59d8d0b0578d40c", question: input });
    console.log("AI Response:", res);
    return res.answer;
};