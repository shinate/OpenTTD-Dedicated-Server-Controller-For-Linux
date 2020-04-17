import events from 'events';

const RULES = [
    { test: /^Map successfully saved to /, loader: 'saved' }
];

export default class commandFeedback extends events {
    dispatcher() {
        return function (content = null) {
            content = content.toString();
            RULES.forEach(r => {
                if (r.test instanceof RegExp) {
                    if (r.test.test(content)) {
                        this.emit(r.loader, content);
                        return false;
                    }
                }
            });
        }.bind(this);
    }
}