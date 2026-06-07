import { renderMarkdown } from '../utils/helpers.js';

const template = await fetch('./js/components/chat-box.html').then(res => res.text());

export default {
    name: 'ChatBox',
    props: {
        messages: { type: Array, required: true },
        isFarsi: { type: Function, required: true }
    },
    setup() {
        return { renderMarkdown };
    },
    template: template
};