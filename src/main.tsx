import "./global.css";
import "./theme/theme.css";
import "./locales/i18n";

import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router";
import App from "./App";
import worker from "./_mock";
import menuService from "./api/services/menuService";
import { registerLocalIcons } from "./components/icon";
import PageError from "./pages/sys/error/PageError";
import { routesSection } from "./routes/sections";
import { urlJoin } from "./utils";

const { VITE_APP_BASE_PATH = "/" } = import.meta.env;

if (import.meta.env.DEV) {
	import("react-scan").then(({ scan }) => {
		scan({
			enabled: false,
			showToolbar: true,
			log: false,
			animationSpeed: "fast",
		});
	});
}
// TODO: you should move worker.start() to the if statement above in production environment
await worker.start({ onUnhandledRequest: "bypass", serviceWorker: { url: urlJoin(VITE_APP_BASE_PATH, "mockServiceWorker.js") } });

await registerLocalIcons();
await menuService.getMenuList();

const router = createBrowserRouter(
	[
		{
			Component: () => (
				<App>
					<Outlet />
				</App>
			),
			errorElement: <ErrorBoundary fallbackRender={PageError} />,
			children: routesSection,
		},
	],
	{
		basename: VITE_APP_BASE_PATH,
	},
);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<RouterProvider router={router} />);
