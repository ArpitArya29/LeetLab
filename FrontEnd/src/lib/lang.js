export function getLanguageName(languageId){
    const languageNames = {
        74: "TypeScript",
        63:"JavaScript",
        71:"Python",
        62:"Java"
    }

    return languageNames[languageId] || "Unknown"
}

export function getlanguageId(language){
    const languageMap = {
        "PYTHON": 71,
        "JAVASCRIPT":63,
        "JAVA":62,
        "TYPESCRIPT":74
    }

    return languageMap[language.toUpperCase()];
}