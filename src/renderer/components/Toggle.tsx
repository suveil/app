import { motion } from "framer-motion";
import React from "react";

interface ToggleProps {
	value: boolean;
	callback: () => void;
}

const Toggle = (props: ToggleProps): React.ReactElement => {
	return (
		<div
			className="top-3 left-3 w-16 h-6 bg-gray-700 p-1"
			onClick={() => {
				props.callback();
			}}
		>
			<motion.div
				className="h-full w-4"
				variants={{
					on: {
						x: 40,
						backgroundColor: "rgb(48,255,48)",
					},
					off: {
						x: 0,
						backgroundColor: "rgb(255,48,48)",
					},
				}}
				transition={{
					bounce: false,
					duration: 0.15,
				}}
				initial={props.value ? "on" : "off"}
				animate={props.value ? "on" : "off"}
			/>
		</div>
	);
};

export default Toggle;
