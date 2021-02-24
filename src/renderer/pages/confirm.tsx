import { motion } from "framer-motion";
import React from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";

const confirm = (props: RouteComponentProps): React.ReactElement => {
	let link = (props?.location?.state as { link: string })?.link;
	link = link !== undefined ? link : "undefined";

	return (
		<>
			<motion.div
				className="full-minus-topbar flex flex-col space-y-1 justify-center items-center content-center text-gray-700"
				initial={{ opacity: 0.5, scale: 0.7 }}
				animate={{ opacity: 1, scale: 1 }}
			>
				<a className="font-custom text-3xl cursor-default text-gray-500 transition duration-300 hover:text-gray-400">
					{link}
				</a>
				<a
					className="text-lg text-gray-600 transition duration-300 hover:text-gray-400"
					href={link}
					target="_blank"
				>
					open link
				</a>
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

export default confirm;
