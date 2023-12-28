import { SR6ChatMessage } from '@/chat/SR6ChatMessage';

export {};

export function register() {
	CONFIG.ChatMessage.documentClass = SR6ChatMessage;
}
