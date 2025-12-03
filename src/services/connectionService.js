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

export const getPendingReceived = () =>
  api.get("/connections/pending/received");
export const getPendingSent = () => api.get("/connections/pending/sent");
export const getConnectionStatus = otherId =>
  api.get(`/connections/status/${otherId}`);
export const rejectConnection = connectionId =>
  api.post("/connections/reject", { connectionId });
