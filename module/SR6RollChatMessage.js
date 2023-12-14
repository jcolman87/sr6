export class SR6ChatMessage extends ChatMessage {
    constructor(data, context) {
        super(data, context);
        console.log("SR6RollChatMessage", this);
    }
    getHTML() {
        return super.getHTML();
    }
}
