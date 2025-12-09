export function isEmployerProfileComplete(p) {
  // Reuse the detailed completeness check so behavior is consistent across callers
  try {
    const detail = getEmployerProfileCompleteness(p);
    return detail?.isComplete ?? false;
  } catch (err) {
    return false;
  }
}

export function getEmployerProfileCompleteness(p) {
  if (!p) {
    return {
      isComplete: false,
      name: false,
      description: false,
      logo: false,
      website: false,
      industry: false,
      social: false,
      contact: false,
      mission: false,
      benefits: false,
      values: false,
      anyAdditional: false,
    };
  }

  const profile = p?.data || p;
  let name = (profile.name || profile.displayName || profile.user?.displayName || profile.user?.name || profile.user?.firstName || profile.fullName || '').toString().trim();
  const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
  // Treat generic placeholders as not provided
  const placeholderNames = ['company', 'companyname', 'yourcompany', 'company name', 'companyname'];
  if (!name || placeholderNames.includes(normalizedName)) {
    name = '';
  }
  const description = Boolean(profile.description && String(profile.description).trim().length >= 20);
  const logo = Boolean(profile.logo);
  const website = Boolean(profile.website);
  const industry = Boolean(profile.industry);
  const social = Boolean(profile.social && (profile.social.linkedin || profile.social.facebook || profile.social.twitter));
  const contact = Boolean(profile.email || profile.phone);
  const mission = Boolean(profile.mission && String(profile.mission).trim().length > 0);
  const benefits = Boolean(profile.benefits && String(profile.benefits).trim().length > 0);
  const values = Boolean(profile.values && String(profile.values).split(',').filter(v => v.trim()).length > 0);

  // We don't consider only contact (email/phone) as sufficient; require one of the 'public-facing' fields or a sufficiently long description
  const anyAdditional = description || logo || website || industry || social || mission || benefits || values;
  const isComplete = Boolean(name && anyAdditional);

  return {
    isComplete,
    name: !!name,
    description,
    logo,
    website,
    industry,
    social,
    contact,
    mission,
    benefits,
    values,
    anyAdditional,
  };
}
