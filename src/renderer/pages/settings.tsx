import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
	settings,
	updateSetting,
	ElectronStoreSettings,
} from "../../controllers/settingsController";
import Image from "../components/Image";
import Toggle from "../components/Toggle";

const BACKGROUND_IMAGES = [
	"url('static://ocean.jpg')",
	"url('static://fuji.jpg')",
	"url('static://autumn.jpg')",
];

interface SettingsOptionProps {
	/** The name to display for the setting. */
	optionDisplayName: string;
	/** The name of the setting in the electron store. */
	settingName: keyof ElectronStoreSettings;
	/** If the setting should be labelled as recommended. */
	isRecommended?: boolean;
}

/** Wrapper component that handles electron-store state. */
const SettingsToggle = (props: {
	settingName: keyof ElectronStoreSettings;
}): React.ReactElement => {
	const [value, setValue] = useState(settings.get(props.settingName));

	useEffect(() => {
		const unsubscribe = settings.onDidChange(props.settingName, (newValue) => {
			setValue(newValue);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<Toggle
			value={value as boolean}
			callback={() => {
				updateSetting(props.settingName, !value);
			}}
		/>
	);
};

/** A table row for a single setting entry. */
const SettingsOption = (props: SettingsOptionProps): React.ReactElement => {
	return (
		<tr className="flex">
			<td className="flex flex-row-reverse justify-right items-center pr-1.5 pt-2 text-2xl text-gray-400 transition duration-200 hover:text-gray-300">
				<div className="w-0 inline-block whitespace-nowrap text-right dir-rtl font-custom">
					<span className="opacity-0">a</span>
					{
						<span className="inline-block text-gray-500 text-base mr-1 font-sans">
							{props.isRecommended && " (recommended) "}
						</span>
					}
					<span>{props.optionDisplayName}</span>
				</div>
			</td>
			<td className="flex flex-row justify-left items-center pl-2 text-2xl text-gray-400 transition duration-300 hover:text-gray-300">
				<div className="w-0 inline-block whitespace-nowrap text-left font-custom">
					<SettingsToggle settingName={props.settingName} />
				</div>
			</td>
		</tr>
	);
};

const Settings = (): React.ReactElement => {
	const [currentImage, setCurrentImage] = useState(BACKGROUND_IMAGES[0]);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImage((value) => {
				const currentIndex = BACKGROUND_IMAGES.indexOf(value);
				const nextIndex = (currentIndex + 1) % BACKGROUND_IMAGES.length;
				return BACKGROUND_IMAGES[nextIndex];
			});
		}, 10000);

		return () => {
			clearInterval(interval);
		};
	}, []);
	return (
		<div className="grid">
			<Image
				src={currentImage}
				className="h-screen w-screen object-cover bg-cover bg-no-repeat bg-center"
			></Image>
			<motion.div
				key="overlay-fade"
				className="absolute z-20 below-topbar h-full w-full"
				style={{
					color: "white",
				}}
				initial={{ backgroundColor: "rgba(22, 24, 27, 1)" }}
				animate={{ backgroundColor: "rgba(22, 24, 27, 0.85)" }}
				transition={{ duration: 0.2, bounce: false }}
			>
				<motion.div
					className="full-minus-topbar flex flex-col space-y-1 justify-center items-center content-center"
					initial={{ opacity: 0.5, scale: 0.7 }}
					animate={{ opacity: 1, scale: 1 }}
				>
					<table>
						<thead>
							<tr className="flex">
								<th className="flex flex-row-reverse justify-right pr-1.5 text-lg text-gray-500">
									<div className="w-0 inline-block whitespace-nowrap text-right dir-rtl">
										setting
									</div>
								</th>
								<th className="flex flex-row justify-left pl-1.5 text-lg text-gray-500">
									<div className="w-0 inline-block whitespace-nowrap text-left">
										value
									</div>
								</th>
							</tr>
						</thead>
						<tbody>
							<SettingsOption
								optionDisplayName="auto launch"
								settingName="autoLaunch"
								isRecommended={true}
							/>
							<SettingsOption
								optionDisplayName="manually open link"
								settingName="confirmLink"
							/>
						</tbody>
					</table>
				</motion.div>
				<div className="w-screen absolute bottom-1 flex flex-row justify-center">
					<Link
						to="/"
						className="text-xl text-gray-500 transition duration-300 hover:text-gray-400"
					>
						{"< home >"}
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default Settings;
