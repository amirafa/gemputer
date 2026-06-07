if (typeof marked !== "undefined") {
    marked.use({ async: false, breaks: true });
}

export const isFarsi = (text) => {
    if (!text || typeof text !== "string") return false;
    const farsiPattern = /[؀-ۿ]/;
    return farsiPattern.test(text);
};

export const renderMarkdown = (text) => {
    try {
        return marked.parse(text);
    } catch (e) {
        return text;
    }
};