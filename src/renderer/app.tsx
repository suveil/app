import "./style.scss";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, useHistory } from "react-router-dom";
import main from "./pages/main";
import settings from "./pages/settings";
import Topbar from "./components/Topbar";
import { ipcRenderer, IpcRendererEvent } from "electron";
import { DiscordJoinRequest } from "../@types/Discord";
import confirm from "./pages/confirm";
import custom from "./pages/custom";

const App = () => {
	const history = useHistory();

	useEffect(() => {
		ipcRenderer.on(
			"rpcSubscription",
			(
				ipcEvent: IpcRendererEvent,
				eventName: keyof typeof rpcSubscriptions,
				eventArgument: any
			) => {
				rpcSubscriptions[eventName](ipcEvent, history, eventArgument);
			}
		);

		return () => {
			ipcRenderer.removeAllListeners("rpcSubscription");
		};
	}, []);

	return (
		<div className="App">
			<Topbar />
			<Switch>
				<Route exact path="/" component={main} />
				<Route exact path="/settings" component={settings} />
				<Route exact path="/confirm" component={confirm} />
				<Route exact path="/custom" component={custom} />
			</Switch>
		</div>
	);
};

const rpcSubscriptions = {
	/*ACTIVITY_JOIN_REQUEST: (
		ipcEvent: IpcRendererEvent,
		history: ReturnType<typeof useHistory>,
		eventArgument: DiscordJoinRequest
	) => {
		console.log(eventArgument);
	},*/

	CONFIRM_LINK: (
		ipcEvent: IpcRendererEvent,
		history: ReturnType<typeof useHistory>,
		eventArgument: string
	) => {
		history.push({
			pathname: "/confirm",
			state: { link: eventArgument },
		});
	},
};

ReactDOM.render(
	<HashRouter>
		<App />
	</HashRouter>,
	document.getElementById("root")
);
