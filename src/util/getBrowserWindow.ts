import { BrowserWindow } from "electron";

export default (): BrowserWindow | undefined => {
	return BrowserWindow.getAllWindows()[0];
};
