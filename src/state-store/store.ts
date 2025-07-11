import { apiServer1 } from "@/api/api-server-1";
import appSlice from "@/state-store/slices/app-slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import {
  combineReducers,
  configureStore,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
  blacklist: [apiServer1.reducerPath], // these reduce will not persist data (NOTE: blacklist rtk api slices so that to use tags)
  // whitelist: ['users'], //these reduce will persist data
};

const getEnhancers = (getDefaultEnhancers: any) => {
  if (process.env.NODE_ENV === "development") {
    const reactotron = require("../utils/reactotronConfig").default;
    return getDefaultEnhancers().concat(reactotron.createEnhancer());
  }
  return getDefaultEnhancers();
};

/**
 * On api error this will be called
 */
export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      console.log("isRejectedWithValue", action.error, action.payload);
      alert(JSON.stringify(action)); // This is just an example. You can replace it with your preferred method for displaying notifications.
    }
    return next(action);
  };

// https://redux-toolkit.js.org/rtk-query/overview#configure-the-store
// Add the generated reducer as a specific top-level slice
const rootReducer = combineReducers({
  app: appSlice,
  apiServer1: apiServer1.reducer,
});
export type RootReducer = ReturnType<typeof rootReducer>;
const persistedReducer = persistReducer<RootReducer>(
  persistConfig,
  rootReducer
);

const store = configureStore({
  reducer: persistedReducer,
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiServer1.middleware, rtkQueryErrorLogger),
  enhancers: getEnhancers,
});

setupListeners(store.dispatch);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
