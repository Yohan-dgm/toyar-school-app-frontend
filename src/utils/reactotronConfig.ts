import Reactotron, { networking } from "reactotron-react-native";
import { reactotronRedux } from "reactotron-redux";

// Reactotron.configure({ name: "app_name", host: "192.168.1.8" })
Reactotron.configure({ name: "app_name" })
  .useReactNative()
  .use(reactotronRedux())
  // @ts-ignore
  .use(networking())
  .connect();

// patch console.log to send log to reactotron
const yeOldeConsoleLog = console.log;
console.log = (...args) => {
  yeOldeConsoleLog(...args);
  Reactotron.display({
    name: "CONSOLE.LOG",
    value: args,
    preview:
      args.length > 0 && typeof args[0] === "string" ? args[0] : undefined,
  });
};

export default Reactotron;
