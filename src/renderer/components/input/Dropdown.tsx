import React, { useCallback } from "react";

const Dropdown = ({
	setValue,
	children,
}: {
	setValue: React.Dispatch<React.SetStateAction<string>>;
	children: React.ReactNode;
}): React.ReactElement => {
	const handleChange = useCallback((e) => {
		setValue(e.target.value);
	}, []);

	return (
		<select
			onChange={handleChange}
			style={{
				verticalAlign: "center",
				paddingBottom: "4px",
			}}
		>
			<option value="" />
			{children}
		</select>
	);
};

export default Dropdown;
