// We read the local HTML file asynchronously using standard fetch
const template = await fetch('./js/components/header.html').then(res => res.text());

export default {
    name: 'ChatHeader',
    emits: ['new-chat'],
    template: template
};