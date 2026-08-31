import React from 'react';
import {
  Zap,
  Wrench,
  Sparkles,
  Snowflake,
  Settings,
  Paintbrush,
  Hammer,
  ShieldCheck,
  Bug,
  Droplets,
  HelpCircle,
} from 'lucide-react';

/**
 * Sanitizes category name to remove demo artifacts like "Updated", "151 Updated", "546 Updated", "988 Updated", etc.
 */
export const sanitizeCategoryName = (rawName = '') => {
  if (!rawName) return 'Home Service';
  
  let cleaned = String(rawName)
    .replace(/\b\d+\s+updated\b/gi, '')
    .replace(/\bupdated\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  // If entire string was just "Updated", give it a sensible name based on fallback
  if (!cleaned) return 'Home Service';
  return cleaned;
};

/**
 * Sanitizes service name to remove demo artifacts
 */
export const sanitizeServiceName = (rawName = '') => {
  if (!rawName) return 'Standard Home Service';
  
  let cleaned = String(rawName)
    .replace(/\b\d+\s+updated\b/gi, '')
    .replace(/\bupdated\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return 'Standard Home Service';
  return cleaned;
};

/**
 * Sanitizes category description
 */
export const sanitizeCategoryDescription = (rawDesc = '', categoryName = '') => {
  if (!rawDesc || rawDesc.toLowerCase().includes('updated description') || rawDesc.toLowerCase().includes('updated')) {
    const name = (categoryName || '').toLowerCase();
    if (name.includes('electr')) {
      return 'Certified electricians for wiring, fixtures, switchboards, and electrical diagnostics.';
    }
    if (name.includes('plumb')) {
      return 'Expert plumbers for tap leaks, sanitary fixtures, drain cleaning & water piping.';
    }
    if (name.includes('clean')) {
      return 'Professional home deep cleaning, kitchen sanitization & bathroom scrubbing.';
    }
    if (name.includes('ac') || name.includes('cool') || name.includes('air condition')) {
      return 'AC servicing, high-pressure jet cleaning, cooling diagnostics, and gas refill.';
    }
    if (name.includes('appliance') || name.includes('machine') || name.includes('fridge')) {
      return 'Skilled technicians for washing machines, refrigerators, and kitchen appliances.';
    }
    if (name.includes('paint')) {
      return 'Interior & exterior house painting, wall waterproofing, and color finish.';
    }
    if (name.includes('carpent') || name.includes('wood') || name.includes('furnitur')) {
      return 'Expert carpentry for furniture assembly, doors, locks, and wood repairs.';
    }
    if (name.includes('pest') || name.includes('bug')) {
      return 'Eco-friendly pest control, termite management, and herbal disinfection.';
    }
    return 'Reliable and background-checked doorstep home service specialists.';
  }

  return rawDesc
    .replace(/\b\d+\s+updated\b/gi, '')
    .replace(/\bupdated\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Sanitizes service description
 */
export const sanitizeServiceDescription = (rawDesc = '', serviceName = '') => {
  if (!rawDesc || rawDesc.toLowerCase().includes('updated description') || rawDesc.toLowerCase().includes('updated')) {
    return 'Complete end-to-end service by background-verified professionals with genuine spare parts support.';
  }

  return rawDesc
    .replace(/\b\d+\s+updated\b/gi, '')
    .replace(/\bupdated\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Returns the appropriate Lucide icon component based on category name or slug.
 */
export const getCategoryIconComponent = (categoryName = '', slug = '') => {
  const query = `${categoryName} ${slug}`.toLowerCase();

  if (query.includes('electr') || query.includes('power') || query.includes('wiring') || query.includes('light')) {
    return Zap;
  }
  if (query.includes('plumb') || query.includes('leak') || query.includes('pipe') || query.includes('drain') || query.includes('tap') || query.includes('water')) {
    return Wrench;
  }
  if (query.includes('clean') || query.includes('scrub') || query.includes('wash') || query.includes('sanit') || query.includes('sofa')) {
    return Sparkles;
  }
  if (query.includes('ac') || query.includes('air condition') || query.includes('cool') || query.includes('hvac') || query.includes('freeze')) {
    return Snowflake;
  }
  if (query.includes('appliance') || query.includes('fridge') || query.includes('machine') || query.includes('oven') || query.includes('geyser') || query.includes('purifier')) {
    return Settings;
  }
  if (query.includes('paint') || query.includes('wall') || query.includes('color') || query.includes('waterproof')) {
    return Paintbrush;
  }
  if (query.includes('carpent') || query.includes('wood') || query.includes('furnitur') || query.includes('lock') || query.includes('door')) {
    return Hammer;
  }
  if (query.includes('pest') || query.includes('termite') || query.includes('cockroach') || query.includes('bug')) {
    return Bug;
  }

  return Wrench;
};

export const getCategoryIcon = getCategoryIconComponent;

/**
 * Renderable Category Icon Component with clean SVG styling
 */
export const CategoryIcon = ({
  categoryName = '',
  slug = '',
  size = 22,
  className = '',
  strokeWidth = 2,
}) => {
  const IconComponent = getCategoryIconComponent(categoryName, slug);
  return <IconComponent size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
};
