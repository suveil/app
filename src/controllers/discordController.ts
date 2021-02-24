/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Client } from "discord-rpc";
import { app, shell } from "electron";
import getBrowserWindow from "../util/getBrowserWindow";
import {
	DiscordJoinActivity,
	DiscordJoinRequest,
	PartialUser,
	PresencePayload,
	SetActivityPayload,
} from "../@types/Discord";
import { getUrlFromJoinSecret } from "../util/urlEncryption";
import isValidURL from "../util/isValidURL";
import isWhitelistedURL from "../util/isWhitelistedURL";
import { settings } from "./settingsController";
import { CLIENT_ID } from "../constants";

let rpcClients: RPCClient[] = [];

type FixedRPCClientType = Client & {
	request(cmd: "SET_ACTIVITY", args: SetActivityPayload): Promise<void>;
};

class RPCClient {
	clientId: string;
	currentPresence: PresencePayload;
	client: FixedRPCClientType;
	clientReady: boolean;

	constructor(
		clientId: string,
		resolveOnceReady?: (value: RPCClient | PromiseLike<RPCClient>) => void
	) {
		this.clientId = clientId;
		this.currentPresence = undefined;
		this.client = new Client({ transport: "ipc" }) as FixedRPCClientType;

		this.client.once("ready", () => {
			this.clientReady = true;
			this.setActivity();

			if (resolveOnceReady) {
				resolveOnceReady(this);
			}
		});

		//discord-rpc typings don't have this
		//@ts-ignore
		this.client.once("disconnected", () => {
			rpcClients = rpcClients.filter(
				(client) => client.clientId !== this.clientId
			);
		});

		this.client
			.login({
				clientId: CLIENT_ID,
			})
			.then(() => {
				this.client.subscribe(
					"ACTIVITY_JOIN",
					(joinObject: DiscordJoinActivity) => {
						console.log("Activity join received.");

						const url = getUrlFromJoinSecret(joinObject.secret);
						if (!isValidURL(url)) {
							return;
						}

						if (!isWhitelistedURL(url)) {
							return;
						}

						if (settings.get("confirmLink")) {
							const browserWindow = getBrowserWindow();
							if (!browserWindow) {
								console.log("No browser window found, aborting...");
								return;
							}

							browserWindow.show();

							browserWindow.webContents.send(
								"rpcSubscription",
								"CONFIRM_LINK",
								url
							);
						} else {
							shell.openExternal(url);
						}
					}
				);

				/*this.client.subscribe(
					"ACTIVITY_JOIN_REQUEST",
					(requestObject: DiscordJoinRequest) => {
						console.log("Activity join request received.");

						const browserWindow = getBrowserWindow();
						if (!browserWindow) {
							console.log("No browser window found, aborting...");
							return;
						}

						browserWindow.webContents.send(
							"rpcSubscription",
							"ACTIVITY_JOIN_REQUEST",
							requestObject
						);
					}
				);*/

				console.log(`Subscribed to RPC events (${this.clientId}).`);
			})
			.catch((err) => {
				console.error(err);
				this.destroy();
			});

		console.log(`Created RPC client (${this.clientId})`);
	}

	async sendJoinInvite(user: PartialUser) {
		await this.client.sendJoinInvite(user);
	}

	async closeJoinRequest(user: PartialUser) {
		await this.client.closeJoinRequest(user);
	}

	setActivity(presencePayload?: PresencePayload) {
		presencePayload = presencePayload || this.currentPresence;

		if (!this.clientReady) {
			this.currentPresence = presencePayload;

			return;
		}

		if (!presencePayload) {
			return;
		}

		this.currentPresence = presencePayload;
		this.client
			.request("SET_ACTIVITY", {
				pid: process.pid,
				activity: presencePayload.presenceData,
			})
			.catch((err) => {
				console.error(err);
				this.destroy();
			});
	}

	clearActivity() {
		this.currentPresence = undefined;

		if (!this.clientReady) {
			return;
		}

		this.client.clearActivity().catch(() => {
			this.destroy();
		});
	}

	async destroy() {
		try {
			console.log(`Destroying RPC client (${this.clientId})`);
			if (this.clientReady) {
				await this.client.clearActivity();
				await this.client.destroy();
			}

			rpcClients = rpcClients.filter(
				(client) => client.clientId !== this.clientId
			);
		} catch (err) {
			console.error(err);
		}
	}
}

export const getAllClients = (): RPCClient[] => {
	return rpcClients;
};

export const getClient = async (clientId: string): Promise<RPCClient> => {
	const client = rpcClients.find((client) => {
		return client.clientId === clientId;
	});

	if (client) {
		return client;
	}

	return new Promise((resolve) => {
		const newClient = new RPCClient(clientId, resolve);
		rpcClients.push(newClient);
	});
};

export const setActivity = (presence: PresencePayload): void => {
	const client = rpcClients.find((client) => {
		return client.clientId === presence.clientId;
	});

	if (!client) {
		const newClient = new RPCClient(presence.clientId);
		rpcClients.push(newClient);

		newClient.setActivity(presence);
	} else {
		client.setActivity(presence);
	}
};

export const clearActivity = (clientId?: string): void => {
	if (!clientId) {
		rpcClients.forEach((client) => {
			client.clearActivity();
		});
	} else {
		const client = rpcClients.find((client) => {
			return client.clientId === clientId;
		});

		client.clearActivity();
	}
};

app.once("will-quit", async () => {
	await Promise.all(rpcClients.map((client) => client.destroy()));
});
