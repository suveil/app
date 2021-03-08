import { register } from "discord-rpc";
import { app, BrowserWindow, ipcMain, session, shell } from "electron";
import { join } from "path";
import { PresencePayload } from "./@types/Discord";
import { CLIENT_ID } from "./constants";
import {
	clearActivity,
	getAllClients,
	getClient,
	setActivity,
} from "./controllers/discordController";
import launchController from "./controllers/launchController";
import {
	ElectronStoreSettings,
	settings,
	updateSetting,
} from "./controllers/settingsController";
import { InitiateTrayController } from "./controllers/trayController";
import { getJoinSecret, getPartyIdFromJoinSecret } from "./util/urlEncryption";

declare let MAIN_WINDOW_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
	// eslint-disable-line global-require
	app.quit();
}

const singleInstanceLock = app.requestSingleInstanceLock();
if (!singleInstanceLock) {
	app.quit();
} else {
	//add to OS registry for Discord so invites and joining works
	register(CLIENT_ID);

	let window: BrowserWindow;
	const createWindow = async () => {
		window = new BrowserWindow({
			width: 800,
			height: 600,
			minWidth: 600,
			minHeight: 400,

			frame: false,
			show: false,

			webPreferences: {
				nodeIntegration: true,
				enableRemoteModule: true,
			},
		});

		InitiateTrayController(window);

		//open links that have target="_blank" in the browser
		window.webContents.on("new-window", (e, url) => {
			e.preventDefault();
			shell.openExternal(url);
		});

		window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

		window.once("ready-to-show", () => {
			window.show();
		});

		ipcMain.on("current-apps", (ipcMainEvent) => {
			ipcMainEvent.returnValue = getAllClients().map((client) => {
				return client.clientId;
			});
		});

		ipcMain.on(
			"set-presence",
			(ipcMainEvent, presencePayload: PresencePayload) => {
				setActivity(presencePayload);
			}
		);

		ipcMain.on("clear-presence", (ipcMainEvent, appId: string) => {
			clearActivity(appId);
		});

		ipcMain.on(
			"set-setting",
			<TSettingName extends keyof ElectronStoreSettings>(
				ipcMainEvent: Electron.IpcMainEvent,
				settingName: TSettingName,
				value: ElectronStoreSettings[TSettingName]
			) => {
				updateSetting(settingName, value);
				ipcMainEvent.returnValue = value;
			}
		);
	};

	app.setAppUserModelId("suyoin.suveil");
	app.setName("suveil");
	app.whenReady().then(async () => {
		//serve static files to the renderer
		session.defaultSession.protocol.registerFileProtocol(
			"static",
			(request, callback) => {
				const fileUrl = request.url.replace("static://", "static/");
				const filePath = join(app.getAppPath(), ".webpack/renderer", fileUrl);
				callback(filePath);
			}
		);

		await Promise.all([launchController()]);

		if (settings.get("defaultPreset")) {
			setActivity(settings.get("defaultPreset"));
		}

		createWindow();
	});

	app.on("second-instance", async (electronEvent, argv) => {
		const discordArg = argv.find((arg) => {
			return arg.match("discord");
		});

		if (discordArg) {
			const appId = discordArg.match(/(\d+)/);
			if (appId) {
				await getClient(appId[1]);
			}

			return;
		}

		if (!window) {
			return;
		}

		window.show();
	});

	// Quit when all windows are closed, except on macOS. There, it's common
	// for applications and their menu bar to stay active until the user quits
	// explicitly with Cmd + Q.
	app.on("window-all-closed", () => {
		if (process.platform !== "darwin") {
			app.quit();
		}
	});

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
}
