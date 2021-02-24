import AutoLaunch from "auto-launch";
import { app } from "electron";
import { settings } from "./settingsController";

const autoLaunch = new AutoLaunch({ name: app.name, isHidden: true });

export default async () => {
	if (!app.isPackaged) {
		return;
	}

	if (settings.get("autoLaunch", true)) {
		await autoLaunch.enable();
	} else {
		await autoLaunch.disable();
	}
};
