import { AppRegistry } from "react-native";
import App from "./App";

console.log("✅ index.web.js pornit");

const rootTag = document.getElementById("root") || document.body;
AppRegistry.registerComponent("folkline2", () => App);
AppRegistry.runApplication("folkline2", { rootTag });
