import { AES } from "crypto-js";

export const getJoinSecret = (url: string, userId: string): string => {
	const truncatedURL = url.replace("https://", "");

	return `[${userId}]${truncatedURL}`;
};

export const getUrlFromJoinSecret = (joinSecret: string): string => {
	return `https://${joinSecret.replace(/^\[\d+\]/, "")}`;
};

export const getPartyIdFromJoinSecret = (joinSecret: string): string => {
	const senderIdMatch = joinSecret.match(/^\[(\d+)\]/);
	if (!senderIdMatch) {
		return;
	}

	const senderId = senderIdMatch[1];
	if (!senderId) {
		return;
	}

	return AES.encrypt(joinSecret.replace(/^\[\d+\]/, ""), senderId).toString();
};
