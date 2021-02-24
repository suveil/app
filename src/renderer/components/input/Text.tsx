import React, { useCallback } from "react";

const TextInput = <T extends string | number>({
	value,
	setValue,
	type,
}: {
	value: T;
	setValue: React.Dispatch<React.SetStateAction<T>>;
	type?: "number" | "string";
}): React.ReactElement => {
	const handleChange = useCallback((e) => {
		setValue(e.target.value);
	}, []);

	return (
		<input type={type || "text"} value={value || ""} onChange={handleChange} />
	);
};

export default TextInput;
