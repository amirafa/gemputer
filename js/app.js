import { createApp, ref, nextTick } from Vue;
import { isFarsi } from './utils/helpers.js';
import { dispatchChatRequest } from './services/puter-api.js';
import ChatHeader from './components/header.js';
import ChatBox from './components/chat-box.js';
import InputArea from './components/input-area.js';

createApp({
    components: {
        ChatHeader,
        ChatBox,
        InputArea
    },
    setup() {
        const userInput = ref("");
        const isLoading = ref(false);
        const useWebSearch = ref(false);
        const attachedImageBase64 = ref(null);
        
        const chatBoxRef = ref(null);

        const getInitialGreetingMessage = () => [
            {
                role: "assistant",
                content: "Hello! I am **GemPuter**. How can I help you today?",
                isThinking: false,
            },
        ];
        const messages = ref(getInitialGreetingMessage());

        const scrollToBottom = async () => {
            await nextTick();
            const el = chatBoxRef.value?.$el;
            if (el) el.scrollTop = el.scrollHeight;
        };

        const startNewChat = () => {
            messages.value = getInitialGreetingMessage();
            userInput.value = "";
            isLoading.value = false;
            attachedImageBase64.value = null;
            scrollToBottom();
        };

        const sendMessage = async () => {
            const text = userInput.value.trim();
            const img = attachedImageBase64.value;
            if ((!text && !img) || isLoading.value) return;

            messages.value.push({
                role: "user",
                content: text || "Analyzing attached image...",
                textSummary: text,
                attachedImage: img,
            });

            userInput.value = "";
            attachedImageBase64.value = null;
            isLoading.value = true;
            await scrollToBottom();

            messages.value.push({
                role: "assistant",
                content: "",
                isThinking: true,
            });
            const aiMessageIndex = messages.value.length - 1;
            await scrollToBottom();

            try {
                const responseStream = await dispatchChatRequest(messages.value, {
                    useWebSearch: useWebSearch.value
                });

                for await (const part of responseStream) {
                    if (part?.text) {
                        if (messages.value[aiMessageIndex].isThinking) {
                            messages.value[aiMessageIndex].isThinking = false;
                        }
                        messages.value[aiMessageIndex].content += part.text;
                        scrollToBottom();
                    }
                }
            } catch (error) {
                if (messages.value[aiMessageIndex] && messages.value[aiMessageIndex].content === "") {
                    messages.value.splice(aiMessageIndex, 1);
                }
                messages.value.push({
                    role: "error",
                    content: "Error: Connection lost or search failed.",
                });
            } finally {
                isLoading.value = false;
                useWebSearch.value = false; 
                if (messages.value[aiMessageIndex]) {
                    messages.value[aiMessageIndex].isThinking = false;
                }
                await scrollToBottom();
            }
        };

        return {
            userInput,
            isLoading,
            useWebSearch,
            attachedImageBase64,
            messages,
            chatBoxRef,
            isFarsi,
            startNewChat,
            sendMessage
        };
    }
}).mount("#app");