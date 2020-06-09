import request from "../../utils/http";
import Qs from 'qs';
export function setSoundStatus({ payload }) {
  const params = Qs.stringify({
    ...payload,
  });
  return request.post("/sprint/stage", params);
}
