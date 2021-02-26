import React, { useCallback } from "react";

const TextInput = <T extends string | number>({
	setValue,
}: {
	setValue: React.Dispatch<React.SetStateAction<T>>;
}): React.ReactElement => {
	const handleChange = useCallback((e) => {
		setValue(e.target.value);
	}, []);

	return <input type="date" onChange={handleChange} />;
};

export default TextInput;
