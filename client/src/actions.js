import axios from "./axios.js";

export const ACTION_CHAT_MESSAGE = "chat message";
export const CHAT_MESSAGES = "chat messages";

export async function chatMessages(messages) {
    return {
        type: CHAT_MESSAGES,
        messages,
    };
}

export const chatMessage = async (message) => {
    return {
        type: ACTION_CHAT_MESSAGE,
        messages: message,
    };
};
