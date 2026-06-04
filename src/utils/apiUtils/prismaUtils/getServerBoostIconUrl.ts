import { getAppSetting } from "./getAppSetting";
import {
  APP_SETTING_SERVER_BOOST_ICON_URL,
  DEFAULT_SERVER_BOOST_ICON_URL,
} from "./tierImageLimits";

export const getServerBoostIconUrl = async (): Promise<string> => {
  const fromDb = await getAppSetting(APP_SETTING_SERVER_BOOST_ICON_URL);
  return fromDb ?? DEFAULT_SERVER_BOOST_ICON_URL;
};
