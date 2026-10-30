import { createContext, useContext } from "react";

const FeatureSettingsContext = createContext(null);

export function useFeatureSettings() {
  return useContext(FeatureSettingsContext);
}

export default FeatureSettingsContext;
