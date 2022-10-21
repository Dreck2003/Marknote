import "./css/root.css";
import "./css/flex-grid.css";
import "./css/colors.css";
import "./css/text.css";
import App from "./App.svelte";

const app = new App({
	target: document.getElementById("app"),
});

export default app;
