/**
 * TrustFix Central Image & Avatar Resolver
 * Provides deterministic, high-quality, category- and service-specific imagery
 * so each home service and provider has a relevant, distinct visual representation.
 */

/**
 * TrustFix Central Image & Avatar Resolver
 * Provides deterministic, high-quality, category- and service-specific imagery
 * so each home service and provider has a relevant, distinct visual representation without duplicates.
 */

// Category default banner / icon images (100% Unique)
const CATEGORY_IMAGES = {
  electrical: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
  plumbing: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
  cleaning: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
  'ac-repair': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format&fit=crop&q=80',
  'ac repair': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format&fit=crop&q=80',
  ac: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format&fit=crop&q=80',
  'appliance-repair': 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&auto=format&fit=crop&q=80',
  'appliance repair': 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&auto=format&fit=crop&q=80',
  appliance: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&auto=format&fit=crop&q=80',
  painting: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
  carpentry: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&auto=format&fit=crop&q=80',
};

// Specific service images based on name/description keywords (100% Unique per trade & sub-specialty)
const SERVICE_IMAGES = [
  // Electrical
  { keywords: ['switchboard', 'socket', 'mcb', 'modular'], url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['wiring', 'cable', 'short circuit', 'wire'], url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['fan', 'light', 'fixture', 'chandelier', 'bulb'], url: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['electrical repair', 'electrician', 'fuse', 'inverter'], url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80' },

  // Plumbing
  { keywords: ['bathroom fixture', 'washbasin', 'shower', 'mixer', 'health faucet'], url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['leak', 'drain', 'pipe', 'flush', 'clog', 'sewage', 'tap'], url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['water tank', 'motor', 'geyser', 'water heater'], url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18015f6?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['plumbing repair', 'master plumber', 'sanitary'], url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&auto=format&fit=crop&q=80' },

  // Cleaning
  { keywords: ['kitchen', 'chimney', 'degreasing', 'gas stove', 'cabinet'], url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['toilet', 'tile', 'scrubbing', 'bathroom scrubbing'], url: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['sofa', 'carpet', 'upholstery', 'mattress'], url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['full home', 'deep clean', 'sanitization', 'deep cleaning'], url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80' },

  // AC Repair
  { keywords: ['gas', 'cooling', 'refill', 'refrigerant', 'charging'], url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['jet', 'servicing', 'coil', 'deep jet'], url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['thermostat', 'compressor', 'hvac', 'ac installation'], url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&auto=format&fit=crop&q=80' },

  // Appliance Repair
  { keywords: ['washing machine', 'laundry', 'drum', 'motor'], url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['refrigerator', 'fridge', 'freezer', 'cooling coil'], url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['microwave', 'oven', 'stove', 'hob', 'pcb'], url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['appliance', 'technician'], url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80' },

  // Painting
  { keywords: ['interior', 'wall', 'touch-up', 'emulsion', 'roller'], url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['waterproof', 'exterior', 'primer', 'texture'], url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['house paint', 'wall painting'], url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80' },

  // Carpentry
  { keywords: ['door', 'lock', 'latch', 'handle', 'hinge'], url: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['furniture', 'wood', 'table', 'chair', 'cupboard', 'wardrobe'], url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['cabinet', 'shelf', 'carpentry'], url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80' },
];

/**
 * Resolves a high-quality, relevant image for a service
 */
export const resolveServiceImage = (service = {}) => {
  const nameText = `${service.name || ''} ${service.description || ''} ${service.categoryName || ''}`.toLowerCase();

  // 1. Specific Keyword Matching (Highest Accuracy)
  for (const item of SERVICE_IMAGES) {
    if (item.keywords.some((kw) => nameText.includes(kw))) {
      return item.url;
    }
  }

  // 2. Category-level mapping
  const catKey = (service.categoryName || '').toLowerCase().trim();
  if (CATEGORY_IMAGES[catKey]) {
    return CATEGORY_IMAGES[catKey];
  }

  for (const key of Object.keys(CATEGORY_IMAGES)) {
    if (catKey.includes(key) || key.includes(catKey)) {
      return CATEGORY_IMAGES[key];
    }
  }

  // 3. If service has a valid unique image URL, use it
  if (service.imageUrl && service.imageUrl.startsWith('http')) {
    return service.imageUrl;
  }
  if (service.image && service.image.startsWith('http')) {
    return service.image;
  }

  return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80';
};

/**
 * Resolves a high-quality, category banner image
 */
export const resolveCategoryImage = (categoryName = '') => {
  const key = categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  return CATEGORY_IMAGES[key] || CATEGORY_IMAGES[categoryName.toLowerCase()] || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80';
};

// Stable distinct provider avatars (100% Unique)
const PROVIDER_AVATARS = [
  'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=240&auto=format&fit=crop&q=80', // Rajesh Kumar (Electrician)
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80', // Priya Sharma (Plumber)
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80', // Amit Verma (AC tech)
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80', // Vikram Singh (Cleaning)
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&auto=format&fit=crop&q=80', // Anand Verma (Pending)
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&auto=format&fit=crop&q=80', // Sunita Rao
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&auto=format&fit=crop&q=80', // Rahul Deshmukh
];

// Distinct Customer / User Avatars
const CUSTOMER_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', // Neha
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80', // Rohan
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', // Ananya
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80', // Karan
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80', // Pooja
];

/**
 * Resolves a distinct, professional avatar for each provider
 */
export const resolveProviderAvatar = (provider = {}) => {
  if (provider.avatarUrl && provider.avatarUrl.startsWith('http')) {
    return provider.avatarUrl;
  }
  if (provider.avatar && provider.avatar.startsWith('http')) {
    return provider.avatar;
  }

  const name = (provider.name || provider.userName || provider.businessName || '').toLowerCase();
  if (name.includes('rajesh')) return PROVIDER_AVATARS[0];
  if (name.includes('priya')) return PROVIDER_AVATARS[1];
  if (name.includes('amit')) return PROVIDER_AVATARS[2];
  if (name.includes('vikram')) return PROVIDER_AVATARS[3];
  if (name.includes('anand')) return PROVIDER_AVATARS[4];
  if (name.includes('sunita')) return PROVIDER_AVATARS[5];
  if (name.includes('rahul')) return PROVIDER_AVATARS[6];

  const id = Number(provider.id || provider.userId || 0);
  const index = Math.abs(id % PROVIDER_AVATARS.length);
  return PROVIDER_AVATARS[index] || PROVIDER_AVATARS[0];
};

/**
 * Resolves a distinct avatar for a customer or review author
 */
export const resolveCustomerAvatar = (user = {}) => {
  if (user?.avatar && user.avatar.startsWith('http')) return user.avatar;
  if (user?.avatarUrl && user.avatarUrl.startsWith('http')) return user.avatarUrl;
  
  const id = Number(user?.id || user?.userId || 1);
  const index = Math.abs(id % CUSTOMER_AVATARS.length);
  return CUSTOMER_AVATARS[index];
};
