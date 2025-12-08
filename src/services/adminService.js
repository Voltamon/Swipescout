import {
  getAdminConnections as getAdminConns,
  purgeRemovedConnections as purgeRemoved
} from "./api.js";

export const getAdminConnections = params => getAdminConns(params);
export const purgeRemovedConnections = params => purgeRemoved(params);
