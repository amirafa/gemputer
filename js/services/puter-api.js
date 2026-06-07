export const dispatchChatRequest = async (messages, options = {}) => {
    const apiHistoryPayload = [];

    messages.forEach((m) => {
        if (m.isThinking || m.role === "error") return;
        if (m.role === "assistant") {
            apiHistoryPayload.push({
                role: "assistant",
                content: m.content,
            });
        } else if (m.role === "user") {
            if (m.attachedImage) {
                apiHistoryPayload.push({
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: m.textSummary || "What do you see?",
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: m.attachedImage,
                            },
                        },
                    ],
                });
            } else {
                apiHistoryPayload.push({
                    role: "user",
                    content: m.content,
                });
            }
        }
    });

    const chatOptions = { stream: true };
    if (options.useWebSearch) {
        chatOptions.model = "openai/gpt-5.2-chat";
        chatOptions.tools = [{ type: "web_search" }];
    } else {
        chatOptions.model = "gpt-5.4-nano";
    }

    return await puter.ai.chat(apiHistoryPayload, chatOptions);
};