import React from "react";
import { remote } from "electron";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const svgHoverVariants = {
	hover: {
		fill: "white",
	},
};

const basicTransition = {
	duration: 0.1,
};

const normalButtonVariants = {
	hover: {
		backgroundColor: "rgba(41, 43, 47)",
	},
};

const Topbar = (): React.ReactElement => {
	const location = useLocation();

	return (
		<div className="w-screen topbar z-50 flex flex-row-reverse fixed">
			<div className="absolute top-0 left-0 text-sm px-2 pt-0.5 flex flex-row justify-start items-center text-center space-x-1 pointer-events-none">
				<a className="text-gray-500 font-custom">suveil</a>
				<a className="text-gray-500 text-xs pb-1.5">{location.pathname}</a>
			</div>

			<motion.div
				className="text-white topbar-button"
				onClick={() => {
					remote.getCurrentWindow().hide();
				}}
				variants={{
					hover: {
						backgroundColor: "rgba(220, 38, 38)",
					},
				}}
				whileHover="hover"
				transition={{ duration: 0.1 }}
			>
				<svg
					className="topbar-button-content"
					aria-hidden="false"
					width="12"
					height="12"
					viewBox="0 0 12 12"
				>
					<motion.polygon
						fill="currentColor"
						fillRule="evenodd"
						points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1"
						variants={svgHoverVariants}
						transition={basicTransition}
					></motion.polygon>
				</svg>
			</motion.div>

			<motion.div
				className="text-white topbar-button"
				onClick={() => {
					const currentWindow = remote.getCurrentWindow();
					if (currentWindow.isMaximized()) {
						currentWindow.unmaximize();
					} else {
						currentWindow.maximize();
					}
				}}
				variants={normalButtonVariants}
				whileHover="hover"
				transition={basicTransition}
			>
				<svg
					className="topbar-button-content"
					aria-hidden="false"
					width="12"
					height="12"
					viewBox="0 0 12 12"
				>
					<motion.rect
						width="10"
						height="8"
						x="1.5"
						y="2.5"
						fill="none"
						stroke="currentColor"
						strokeWidth="1"
						variants={{
							hover: {
								stroke: "white",
							},
						}}
						transition={basicTransition}
					></motion.rect>
				</svg>
			</motion.div>

			<motion.div
				className="text-white topbar-button"
				onClick={() => {
					remote.getCurrentWindow().minimize();
				}}
				variants={normalButtonVariants}
				whileHover="hover"
				transition={basicTransition}
			>
				<svg
					className="topbar-button-content"
					aria-hidden="false"
					width="12"
					height="12"
					viewBox="0 0 12 12"
				>
					<motion.rect
						fill="currentColor"
						width="10"
						height="1.5"
						x="1"
						y="6"
						variants={svgHoverVariants}
						transition={basicTransition}
					></motion.rect>
				</svg>
			</motion.div>
		</div>
	);
};

export default Topbar;
