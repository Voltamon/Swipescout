import axios from 'axios';

export const getMyPointsSummary = async () => {
  const { data } = await axios.get('/api/points/me');
  return data.summary || data;
};

export const getMyPointsHistory = async (page = 1, limit = 20) => {
  const { data } = await axios.get('/api/points/history', { params: { page, limit } });
  return data;
};

export const getConversions = async () => {
  const { data } = await axios.get('/api/points/conversions');
  return data.conversions || [];
};

export const redeemConversion = async (key, type) => {
  const { data } = await axios.post('/api/points/redeem', { key, type });
  return data;
};

// Admin
export const getAdminPointsRules = async () => {
  const { data } = await axios.get('/api/admin/points/rules');
  return data.rules || [];
};

export const saveAdminPointsRules = async (rules) => {
  const { data } = await axios.put('/api/admin/points/rules', { rules });
  return data.rules || [];
};

export const getAdminPointsConversions = async () => {
  const { data } = await axios.get('/api/admin/points/conversions');
  return data.conversions || [];
};

export const saveAdminPointsConversions = async (conversions) => {
  const { data } = await axios.put('/api/admin/points/conversions', { conversions });
  return data.conversions || [];
};

export const getAdminPointsTiers = async () => {
  const { data } = await axios.get('/api/admin/points/tiers');
  return data.tiers || [];
};

export const saveAdminPointsTiers = async (tiers) => {
  const { data } = await axios.put('/api/admin/points/tiers', { tiers });
  return data.tiers || [];
};

export const getAdminUsersPoints = async (page = 1, limit = 20, search = '') => {
  const { data } = await axios.get('/api/admin/points/users', { params: { page, limit, search } });
  return data;
};
