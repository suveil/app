import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";
import AppTray from "../components/AppTray";

const Main = (): React.ReactElement => {
	return (
		<>
			<motion.div
				className="full-minus-topbar flex flex-col space-y-1 justify-center items-center content-center text-gray-700"
				initial={{ opacity: 0.5, scale: 0.7 }}
				animate={{ opacity: 1, scale: 1 }}
			>
				<a className="font-custom text-9xl cursor-default transition duration-300 hover:text-gray-600">
					suveil
				</a>
			</motion.div>
			<AppTray />
			<div className="w-screen absolute bottom-10 flex flex-row justify-center">
				<Link
					to="/custom"
					className="text-xl text-gray-500 transition duration-300 hover:text-gray-400"
				>
					{"< custom presence >"}
				</Link>
			</div>
			<div className="w-screen absolute bottom-1 flex flex-row justify-center">
				<Link
					to="/settings"
					className="text-xl text-gray-500 transition duration-300 hover:text-gray-400"
				>
					{"< settings >"}
				</Link>
			</div>
		</>
	);
};

export default Main;
