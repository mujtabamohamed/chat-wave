import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    conversationId: {
        type: String,
    },
    senderId: {
        type: String,
    },
    message: {
        type: String,
    },
    time: {
        type: String,
        default: new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23'
        }).format(Date.now()),
    }  
});

const Messages = mongoose.model('Message', messageSchema);

export default Messages;