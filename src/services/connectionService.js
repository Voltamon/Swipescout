import api from "./api.js";

/**
 * Connection service: send/accept/list connections
 */
export const sendConnection = receiverId => {
  return api.post(`/connections`, { receiverId });
};

export const acceptConnection = connectionId => {
  return api.post(`/connections/accept`, { connectionId });
};

export const getConnections = () => {
  return api.get(`/connections`);
};
