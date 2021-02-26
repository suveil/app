//Used in the main process instead of the static:// protocol
import { app } from "electron";
import { join } from "path";

export default (filePath: string) => {
	return app.isPackaged
		? join(app.getAppPath(), ".webpack/renderer", filePath)
		: join(app.getAppPath(), filePath);
};
