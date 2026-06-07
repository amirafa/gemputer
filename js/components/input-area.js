import { ref } from Vue;

const template = await fetch("./js/components/input-area.html").then((res) =>
    res.text(),
);

export default {
    name: "InputArea",
    props: {
        userInput: {
            type: String,
            default: "",
        },
        useWebSearch: Boolean,
        attachedImageBase64: String,
        isLoading: Boolean,
        isFarsi: Function,
    },
    emits: [
        "update:userInput",
        "update:useWebSearch",
        "update:attachedImageBase64",
        "send",
    ],
    setup(props, { emit }) {
        const imageFileInput = ref(null);
        const inputField = ref(null);

        const handleImageSelection = (event) => {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) =>
                emit("update:attachedImageBase64", e.target.result);
            reader.readAsDataURL(file);
        };

        const clearSelectedImage = () => {
            emit("update:attachedImageBase64", null);
            if (imageFileInput.value) imageFileInput.value.value = "";
        };

        const focusInput = () => inputField.value?.focus();

        return {
            imageFileInput,
            inputField,
            handleImageSelection,
            clearSelectedImage,
            focusInput,
        };
    },
    template: template,
};
