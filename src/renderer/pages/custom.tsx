/* eslint-disable @typescript-eslint/ban-ts-comment */
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DiscordUserPopout from "../components/DiscordUserPopout";
import TextInput from "../components/input/Text";
import Dropdown from "../components/input/Dropdown";
import axios from "axios";
import { DiscordApplicationAsset, PresencePayload } from "../../@types/Discord";
import { ipcRenderer } from "electron";

const InputContainer = ({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}): React.ReactElement => {
	return (
		<div className="py-5">
			<label className="block mb-2 pl-0.5 uppercase leading-4 text-sm font-semibold text-gray-500">
				{label}
			</label>
			{children}
		</div>
	);
};

const custom = (): React.ReactElement => {
	const [details, setDetails] = useState("");
	const [presenceState, setPresenceState] = useState("");

	const [largeImage, setLargeImage] = useState("");
	const [largeText, setLargeText] = useState("");
	const [smallImage, setSmallImage] = useState("");
	const [smallText, setSmallText] = useState("");

	const [startTimestamp, setStartTimestamp] = useState<number>();
	const [endTimestamp, setEndTimestamp] = useState<number>();

	const [partyId, setPartyId] = useState("");

	const [partySize, setPartySize] = useState<number>();
	const [partyMax, setPartyMax] = useState<number>();

	const [joinSecret, setJoinSecret] = useState("");

	const [button1Label, setButton1Label] = useState("");
	const [button1Url, setButton1Url] = useState("");
	const [button2Label, setButton2Label] = useState("");
	const [button2Url, setButton2Url] = useState("");

	const appId = "802405845572517918";

	const [assetImages, setAssetImages] = useState([]);
	useEffect(() => {
		axios
			.get<DiscordApplicationAsset[]>(
				`https://discordapp.com/api/oauth2/applications/${appId}/assets`
			)
			.then((assetsResponse) => {
				setAssetImages(
					assetsResponse.data.map((appAsset) => {
						return {
							name: appAsset.name,
							url: `https://cdn.discordapp.com/app-assets/${appId}/${appAsset.id}.png`,
						};
					})
				);
			});
	}, [appId]);

	const constructPayloadFromStates = (
		useAssetId?: boolean
	): PresencePayload => {
		const payload = {
			clientId: appId,
			presenceData: {
				type: 0,
			},
		};

		if (details) {
			//@ts-ignore
			payload.presenceData.details =
				details.length < 2 ? details + " " : details;
		}
		if (presenceState) {
			//@ts-ignore
			payload.presenceData.state =
				presenceState.length < 2 ? presenceState + " " : presenceState;
		}

		if (partyId && partySize && partyMax) {
			//@ts-ignore
			payload.presenceData.party = {
				id: partyId.length < 2 ? partyId + " " : partyId,
				//@ts-ignore
				size: [parseInt(partySize), parseInt(partyMax)],
			};
		}

		if (startTimestamp || endTimestamp) {
			if (startTimestamp) {
				//@ts-ignore
				payload.presenceData.timestamps = {
					//@ts-ignore
					start: parseInt(startTimestamp),
				};
			}

			if (endTimestamp) {
				//@ts-ignore
				if (!payload.presenceData.timestamps) {
					//@ts-ignore
					payload.presenceData.timestamps = {};
				}
				//@ts-ignore
				payload.presenceData.timestamps.end = parseInt(endTimestamp);
			}
		}

		if (largeImage) {
			//@ts-ignore
			payload.presenceData.assets = {
				large_image: !useAssetId
					? largeImage
					: assetImages.find((asset) => {
							return asset.url === largeImage;
					  }).name,
			};

			if (largeText) {
				//@ts-ignore
				payload.presenceData.assets.large_text = largeText;
			}

			if (smallImage) {
				//@ts-ignore
				payload.presenceData.assets.small_image = !useAssetId
					? smallImage
					: assetImages.find((asset) => {
							return asset.url === smallImage;
					  }).name;
				if (smallText) {
					//@ts-ignore
					payload.presenceData.assets.small_text = smallText;
				}
			}
		}

		if (joinSecret) {
			//@ts-ignore
			payload.presenceData.secrets = {
				join: joinSecret.length < 2 ? joinSecret + " " : joinSecret,
			};
		}

		if (button1Label && button1Url) {
			//@ts-ignore
			if (!payload.presenceData.buttons) {
				//@ts-ignore
				payload.presenceData.buttons = [];
			} //@ts-ignore
			payload.presenceData.buttons.push({
				label: button1Label,
				url: button1Url,
			});
		}

		if (button2Label && button2Url) {
			//@ts-ignore
			if (!payload.presenceData.buttons) {
				//@ts-ignore
				payload.presenceData.buttons = [];
			} //@ts-ignore
			payload.presenceData.buttons.push({
				label: button2Label,
				url: button2Url,
			});
		}

		return payload;
	};

	return (
		<>
			<div className="absolute bottom-1 flex flex-col justify-center right-1">
				<a className="font-custom text-center text-2xl cursor-default text-gray-600">
					preview
				</a>

				<DiscordUserPopout PresencePayload={constructPayloadFromStates()} />
			</div>
			<motion.div
				className="full-minus-topbar flex flex-col -space-y-6 justify-center items-center content-center text-gray-700"
				initial={{ opacity: 0.5, scale: 0.7 }}
				animate={{ opacity: 1, scale: 1 }}
			>
				<a className="font-custom text-3xl pb-2 cursor-default text-gray-500 transition duration-300 hover:text-gray-400">
					settings
				</a>
				<div className="flex flex-row space-x-2">
					<div className="flex flex-col -space-y-6">
						<div className="flex flex-row space-x-2">
							<InputContainer label="details">
								<TextInput value={details} setValue={setDetails} />
							</InputContainer>

							<InputContainer label="state">
								<TextInput value={presenceState} setValue={setPresenceState} />
							</InputContainer>
						</div>
						<div className="flex flex-row space-x-2">
							<InputContainer label="start timestamp">
								<TextInput
									type="number"
									value={startTimestamp}
									setValue={setStartTimestamp}
								/>
							</InputContainer>
							<InputContainer label="end timestamp">
								<TextInput
									type="number"
									value={endTimestamp}
									setValue={setEndTimestamp}
								/>
							</InputContainer>
						</div>
					</div>
					<div className="flex flex-col -space-y-6">
						<div className="flex flex-row space-x-2">
							<InputContainer label="large image">
								<Dropdown setValue={setLargeImage}>
									<>
										{assetImages.map((asset) => {
											return (
												<option key={asset.name} value={asset.url}>
													{asset.name}
												</option>
											);
										})}
									</>
								</Dropdown>
							</InputContainer>
							<InputContainer label="large text">
								<TextInput value={largeText} setValue={setLargeText} />
							</InputContainer>
						</div>
						<div className="flex flex-row space-x-2">
							<InputContainer label="small image">
								<Dropdown setValue={setSmallImage}>
									<>
										{assetImages.map((asset) => {
											return (
												<option key={asset.name} value={asset.url}>
													{asset.name}
												</option>
											);
										})}
									</>
								</Dropdown>
							</InputContainer>
							<InputContainer label="small text">
								<TextInput value={smallText} setValue={setSmallText} />
							</InputContainer>
						</div>
					</div>
				</div>

				<div className="flex flex-row space-x-2">
					<InputContainer label="party id">
						<TextInput value={partyId} setValue={setPartyId} />
					</InputContainer>

					<InputContainer label="party size">
						<TextInput
							type="number"
							value={partySize}
							setValue={setPartySize}
						/>
					</InputContainer>
					<InputContainer label="party max">
						<TextInput type="number" value={partyMax} setValue={setPartyMax} />
					</InputContainer>
				</div>
				<div className="flex flex-row space-x-2">
					<InputContainer label="join secret">
						<TextInput value={joinSecret} setValue={setJoinSecret} />
					</InputContainer>
				</div>
				<div className="flex flex-row space-x-2">
					<InputContainer label="button 1 label">
						<TextInput value={button1Label} setValue={setButton1Label} />
					</InputContainer>
					<InputContainer label="button 1 url">
						<TextInput value={button1Url} setValue={setButton1Url} />
					</InputContainer>
				</div>
				<div className="flex flex-row space-x-2">
					<InputContainer label="button 2 label">
						<TextInput value={button2Label} setValue={setButton2Label} />
					</InputContainer>
					<InputContainer label="button 2 url">
						<TextInput value={button2Url} setValue={setButton2Url} />
					</InputContainer>
				</div>

				<div className="flex flex-row space-x-2">
					<div className="py-5">
						<input
							className="cursor-pointer"
							type="button"
							value="Clear Activity"
							onClick={() => {
								ipcRenderer.send("clear-presence", appId);
							}}
						/>
					</div>
					<div className="py-5">
						<input
							className="cursor-pointer"
							type="button"
							value="Submit"
							onClick={() => {
								ipcRenderer.send(
									"set-presence",
									constructPayloadFromStates(true)
								);
							}}
						/>
					</div>
					<div className="py-5">
						<input
							className="cursor-pointer"
							type="button"
							value="Save as Default"
							onClick={() => {
								ipcRenderer.send(
									"set-preset",
									constructPayloadFromStates(true)
								);
							}}
						/>
					</div>
				</div>
			</motion.div>

			<div className="w-screen absolute bottom-1 flex flex-row justify-center">
				<Link
					to="/"
					className="text-xl text-gray-500 transition duration-300 hover:text-gray-400"
				>
					{"< home >"}
				</Link>
			</div>
		</>
	);
};

export default custom;
