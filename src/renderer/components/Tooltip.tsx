import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const Tooltip = (props: { children: React.ReactNode }): React.ReactElement => {
	const realRef = useRef<HTMLDivElement>();

	const portal = ReactDOM.createPortal(
		<div />,
		document.getElementById("modal")
	);

	useEffect(() => {
		if (!realRef.current) {
			return;
		}

		const mouseOverCallback = (ev: MouseEvent) => {
			console.log("hover");
		};

		const mouseLeaveCallback = (ev: MouseEvent) => {
			console.log("leave hover");
		};

		realRef.current.addEventListener("mouseover", mouseOverCallback, false);
		realRef.current.addEventListener("mouseleave", mouseLeaveCallback, false);

		return () => {
			if (realRef.current) {
				realRef.current.removeEventListener("mouseover", mouseOverCallback);
				realRef.current.removeEventListener("mouseleave", mouseLeaveCallback);
			}
		};
	}, []);

	return (
		<>
			{portal}
			<div ref={realRef}>{props.children}</div>
		</>
	);
};

export default Tooltip;
