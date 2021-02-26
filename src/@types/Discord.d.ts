enum PresenceActivityType {
	Game = 0,
	Streaming = 1,
	Listening = 2,
	Custom = 4,
	Competing = 5,
}

interface DiscordEmoji {
	name: string;
	id: string;
	animated?: boolean;
}

interface DiscordApplicationAsset {
	id: string;
	type: 1;
	name: string;
}

interface PresenceParty {
	id?: string;
	size?: [int, int];
}

interface PresenceButton {
	label: string;
	url: string;
}

interface SetActivityPayload {
	pid: number;
	activity: PresencePayload["presenceData"];
}

export interface PresencePayload {
	clientId: string;
	presenceData: {
		/** Not applicable for type=0 */
		name?: string;
		/** As of now, can only be type=0|3. I have no idea what 3 is. */
		type: PresenceActivityType;

		/** Only applicable for type=1. Only Twitch and YouTube are validated. */
		url?: string;

		/** Unix timestamp of when the activity was added to the user session. */
		created_at?: int;

		timestamps?: {
			start?: int;
			end?: int;
		};

		/** The application id snowflake. I'm not sure when Discord accepts this. */
		application_id?: string;

		details?: string;
		state?: string;

		/** Only works with type=4. */
		emoji?: DiscordEmoji;

		party?: PresenceParty;
		assets?: {
			large_image?: string;
			large_text?: string;
			small_image?: string;
			small_text?: string;
		};

		/** Secrets are not accepted when buttons are included. */
		secrets?: {
			join?: string;
			spectate?: string;
			match?: string;
		};

		/** Buttons are not accepted when secrets are included. */
		buttons?: PresenceButton[];
	};

	isPlaying?: boolean; //if something is playing
}

export interface PartialUser {
	id: string;
	username: string;
	discriminator: string;
	avatar: string;
	bot: boolean;
	flags: number;
	premium_type: number;
}

export interface DiscordJoinRequest {
	user: PartialUser;
}

export interface DiscordJoinActivity {
	secret: string;
}
