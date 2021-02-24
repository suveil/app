import ElectronStore from "electron-store";

export interface ElectronStoreSettings {
	autoLaunch: boolean;
	confirmLink: boolean;
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
