import ElectronStore from "electron-store";
import { PresencePayload } from "../@types/Discord";

export interface ElectronStoreSettings {
	autoLaunch: boolean;
	confirmLink: boolean;

	defaultPreset?: PresencePayload;
}

export const settings = new ElectronStore({
	defaults: {
		autoLaunch: true,
		confirmLink: false,
	} as ElectronStoreSettings,
});

export const updateSetting = <TKey extends keyof ElectronStoreSettings>(
	key: TKey,
	value: ElectronStoreSettings[TKey]
): void => {
	settings.set(key, value);
};
