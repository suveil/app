//Image component that remembers the previous image src given to transition

import React, { useEffect, useState } from "react";
import { AnimationProps, motion } from "framer-motion";

const Image = (props: {
	src: string;
	containerStyle?: string;
	className?: string;
	variants?: AnimationProps["variants"];
}): React.ReactElement => {
	const { src, containerStyle, className, variants } = props;

	const [topSrc, setTopSrc] = useState(src);
	const [bottomSrc, setBottomSrc] = useState(src);

	useEffect(() => {
		if (topSrc !== src) {
			setBottomSrc(topSrc);
			setTopSrc(src);
		}
	}, [src]);

	return (
		<div className={containerStyle}>
			{topSrc && (
				<motion.img
					key={topSrc}
					className={className + " absolute"}
					style={{ content: topSrc }}
					variants={variants}
				/>
			)}
			{bottomSrc && topSrc !== bottomSrc && (
				<motion.img
					key={bottomSrc} //do this in case the top & bottom images are the same
					className={className + " absolute"}
					style={{ content: bottomSrc }}
					initial={{ opacity: 0.99 }}
					animate={{ opacity: 0 }}
					transition={{ duration: 1 }}
					variants={variants}
				/>
			)}
		</div>
	);
};

export default Image;
