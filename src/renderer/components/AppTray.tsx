import { ipcRenderer } from "electron";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import AppIcon from "./AppIcon";

const AppTray = (): React.ReactElement => {
	const [appIds, setAppIds] = useState<string[]>([]);

	useEffect(() => {
		const currentAppIds: string[] = ipcRenderer.sendSync("current-apps");

		setAppIds(currentAppIds);
	}, []);

	return (
		<motion.div
			className="absolute z-10 bottom-1 left-1 justify-start flex flex-row -space-x-7"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1, delay: 0.1 }}
		>
			<>
				{appIds.map((appId) => {
					return <AppIcon key={appId} appId={appId} />;
				})}
			</>
		</motion.div>
	);
};

export default AppTray;
