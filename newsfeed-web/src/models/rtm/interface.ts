export interface Message {
  type: string;
  data: KickoutDevices | KickWebUser;
  ts: number;
}

export interface KickoutDevices {
  message: string;
  access_tokens: string[];
}

export interface KickWebUser {
  message: string;
}
