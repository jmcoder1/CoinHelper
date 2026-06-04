import {
  BRONZE_ROLE_NAME,
  DIAMOND_ROLE_NAME,
  GOLD_ROLE_NAME,
  SILVER_ROLE_NAME,
} from "./constants";

/** Default image limits applied when tier roles are first created. */
export const DEFAULT_TIER_IMAGE_LIMIT_BY_ROLE_NAME: Record<string, number | null> =
  {
    [BRONZE_ROLE_NAME]: 3,
    [SILVER_ROLE_NAME]: 4,
    [GOLD_ROLE_NAME]: 5,
    [DIAMOND_ROLE_NAME]: null,
  };

export const DEFAULT_NEW_MEMBER_IMAGE_LIMIT = 1;

export const APP_SETTING_NEW_MEMBER_IMAGE_LIMIT = "new_member_image_limit";
export const APP_SETTING_SERVER_BOOST_ICON_URL = "server_boost_icon_url";

export const DEFAULT_SERVER_BOOST_ICON_URL =
  "https://media.sketchfab.com/models/7218d808cf2d46db9fcca7f96aebd76f/thumbnails/40a5430b011647bbafa078d38b0c919e/5fc1f8cf89ea4cfa8bbc77eb1ba2ce31.jpeg";

export const getDefaultTierImageLimit = (
  roleName: string,
): number | null | undefined =>
  DEFAULT_TIER_IMAGE_LIMIT_BY_ROLE_NAME[roleName];
