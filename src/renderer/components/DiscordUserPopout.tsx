import React from "react";
import { PresenceButton, PresencePayload } from "../../@types/Discord";

interface PopoutProps {
	PresencePayload: PresencePayload;
}

const PopoutButton = (props: { Button: PresenceButton }) => {
	return (
		<div
			key={props.Button.label}
			className="flex flex-row items-stretch justify-start box-border flex-nowrap mt-2"
		>
			<button
				className="relative w-full h-8 text-sm font-normal box-border cursor-pointer inline-block"
				style={{
					minHeight: "32px",
					border: "1px solid hsla(0,0%,100%,0.3)",
					letterSpacing: ".3px",
					borderRadius: "3px",
					background: "none",
					padding: "0 20px",
				}}
			>
				<div className="relative h-full flex flex-row flex-wrap justify-center items-center">
					{props.Button.label}
				</div>
			</button>
		</div>
	);
};

const toMMSS = (secondsSinceEpoch: number): string => {
	if (secondsSinceEpoch < 0) {
		return "00:00";
	}

	const hours: number = Math.floor(secondsSinceEpoch / 3600);
	let minutes: string | number = Math.floor(
		(secondsSinceEpoch - hours * 3600) / 60
	);
	let seconds: string | number = Math.floor(
		secondsSinceEpoch - hours * 3600 - minutes * 60
	);

	if (minutes < 10) {
		minutes = "0" + minutes;
	}

	if (seconds < 10) {
		seconds = "0" + seconds;
	}

	return `${minutes}:${seconds}`;
};

const DiscordUserPopout = (props: PopoutProps): React.ReactElement => {
	const presence = props.PresencePayload.presenceData;

	let timeString;
	if (presence.timestamps) {
		if (presence.timestamps.start && presence.timestamps.end) {
			timeString = `${toMMSS(
				presence.timestamps.end - presence.timestamps.start
			)} left`;
		} else if (presence.timestamps.start) {
			timeString = `${toMMSS(
				new Date().getTime() / 1000 - presence.timestamps.start
			)} elapsed`;
		} else if (presence.timestamps.end) {
			timeString = `${toMMSS(
				presence.timestamps.end - new Date().getTime() / 1000
			)} left`;
		}
	}

	return (
		<div
			className="text-base text-white leading-5 w-64"
			style={{
				background: "#7289da",
				borderRadius: "3px",
			}}
		>
			<div className="block" style={{ backgroundColor: "rgba(0,0,0,0.05)" }}>
				<div className="p-5">
					<div className="text-left mb-2 uppercase leading-4 font-bold text-xs">
						Playing a game
					</div>
					<div className="flex items-start">
						{presence.assets?.large_image && (
							<div className="relative block">
								<img
									src={presence.assets?.large_image}
									style={{
										width: "60px",
										height: "60px",
										borderRadius: "4px",
										objectFit: "cover",
										display: "block",
									}}
								/>
								{presence.assets?.small_image && (
									<img
										src={presence.assets?.small_image}
										style={{
											width: "30px",
											height: "30px",
											borderRadius: "50%",
											position: "absolute",
											bottom: "-4px",
											right: "-4px",
											objectFit: "cover",
										}}
									/>
								)}
							</div>
						)}
						<div
							style={{
								marginLeft: presence.assets?.large_image ? "10px" : "0px",
								overflow: "hidden",
								display: "block",
								flex: 1,
							}}
						>
							<div
								className="block text-sm leading-4 whitespace-nowrap overflow-hidden overflow-ellipsis font-semibold"
								style={{
									marginBottom: "2px",
								}}
							>
								suyoinker
							</div>
							{presence.details && (
								<div
									className="block text-sm leading-4 whitespace-nowrap overflow-hidden overflow-ellipsis font-semibold"
									style={{
										marginBottom: "2px",
									}}
								>
									{presence.details}
								</div>
							)}
							{presence.state && (
								<div
									className="block text-sm leading-4 whitespace-nowrap overflow-hidden overflow-ellipsis font-semibold"
									style={{
										marginBottom: "2px",
									}}
								>
									{presence.state}
									{presence.party &&
										presence.party.id &&
										presence.party.size &&
										presence.party.size[0] &&
										presence.party.size[1] &&
										` (${presence.party.size[0]} of ${presence.party.size[1]})`}
								</div>
							)}
							{timeString && (
								<div
									className="block text-sm leading-4 whitespace-nowrap overflow-hidden overflow-ellipsis font-semibold"
									style={{
										marginBottom: "2px",
									}}
								>
									{timeString}
								</div>
							)}
						</div>
					</div>
					{presence.buttons && (
						<>
							{presence.buttons.map((button) => {
								if (!button || !button.label || !button.url) {
									return;
								}

								return <PopoutButton Button={button} />;
							})}
						</>
					)}
					{presence.secrets?.join && (
						<PopoutButton Button={{ label: "Ask to Join", url: "noop" }} />
					)}
				</div>
			</div>
		</div>
	);
};

export default DiscordUserPopout;
