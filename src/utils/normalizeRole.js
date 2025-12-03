export default function normalizeRole(role) {
  if (!role) return null;
  if (Array.isArray(role)) role = role[0];
  if (typeof role !== 'string') return null;
  return role.toLowerCase().replace(/[-\s]/g, '_');
}
