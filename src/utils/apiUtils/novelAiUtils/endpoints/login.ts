import axios from "axios";
import { API_ENDPOINT } from "../constants";
import { tryAsyncAwait } from "../../../tryAsyncAwait";
import { calcAccessKey } from "../calcAccessKey";

export const login = async (
  email: string,
  password: string
): Promise<{ accessToken: string } | null> => {
  const key = await calcAccessKey(email, password);
  const [res, error] = await tryAsyncAwait(() => {
    return axios.post(
      API_ENDPOINT + "/user/login",
      {
        key,
      },
      {
        headers: { "content-type": "application/json" },
      }
    );
  });
  if (error || !res) {
    console.error(error);
    return error;
  }

  return res.data;
};
