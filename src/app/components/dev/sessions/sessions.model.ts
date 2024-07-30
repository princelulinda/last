export interface activeSessionResponse {
  objects: activeSessionResponse[];
  count: number;
  length: number;
  id: string;
  location: string;
  user_ip_address: string;
  session_duration: string;
  device: {
    user_agent_data: {
      device_brand: {
        family: string;
      };
      browser: {
        family: string;
      };
      os: {
        family: string;
      };
    };
  };
}
export interface historySessionResponse {
  count: number;
  objects: historySessionResponse[];
  location: string;
  user_ip_address: string;
  id: string;
  session_duration: Date;
  last_activity: string;
  device: {
    user_agent_data: {
      device_brand: {
        family: string;
      };
      browser: {
        family: string;
      };
      os: {
        family: string;
      };
    };
  };
}
