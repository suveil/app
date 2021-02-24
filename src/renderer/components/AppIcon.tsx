import axios from "axios";
import React, { useEffect, useState } from "react";
import { DiscordApplicationAsset } from "../../@types/Discord";
import Tooltip from "./Tooltip";

const cachedImageUrls: Map<string, string> = new Map<string, string>();

const AppIcon = ({ appId }: { appId: string }): React.ReactElement => {
	const [imageUrl, setImageUrl] = useState(cachedImageUrls.get(appId));

	//fetch assets and get the first app-asset image
	useEffect(() => {
		if (!imageUrl) {
			axios
				.get<DiscordApplicationAsset[]>(
					`https://discordapp.com/api/oauth2/applications/${appId}/assets`
				)
				.then((assetsResponse) => {
					const firstEntry = assetsResponse.data[0];

					cachedImageUrls.set(
						appId,
						`https://cdn.discordapp.com/app-assets/${appId}/${firstEntry.id}.png`
					);

					setImageUrl(cachedImageUrls.get(appId));
				});
		}
	}, []);

	return (
		<Tooltip>
			<div className="flex flex-col items-center justify-center rounded-full bg-gray-700 w-11 h-11">
				<img
					className="rounded-full object-cover bg-cover w-10 h-10"
					src={imageUrl !== undefined ? imageUrl : ""}
				/>
			</div>
		</Tooltip>
	);
};

export default AppIcon;
