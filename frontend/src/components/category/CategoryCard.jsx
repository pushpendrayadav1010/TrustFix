import React from 'react';
import { Link } from 'react-router-dom';
import { CategoryIcon, sanitizeCategoryName, sanitizeCategoryDescription } from '../../utils/categoryIcons';
import { ArrowRight } from 'lucide-react';

export const CategoryCard = ({ category }) => {
  const cleanName = sanitizeCategoryName(category?.name || '');
  const cleanDesc = sanitizeCategoryDescription(category?.description || '', cleanName);
  const slug = category?.slug || cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <Link
      to={`/services?category=${category?.id || slug}`}
      className="card card-hoverable"
      style={{
        padding: '1.5rem',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: 'var(--white)',
        height: '100%',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--primary-100)',
          color: 'var(--primary-800)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          border: '1px solid var(--primary-200)',
        }}
      >
        <CategoryIcon categoryName={cleanName} slug={slug} size={24} strokeWidth={2} />
      </div>

      <h4
        style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          color: 'var(--neutral-900)',
          marginBottom: '0.35rem',
        }}
      >
        {cleanName}
      </h4>

      <p
        className="text-xs text-muted line-clamp-2"
        style={{
          marginBottom: '1.25rem',
          lineHeight: 1.5,
          flex: 1,
        }}
      >
        {cleanDesc}
      </p>

      <span
        className="text-xs font-semibold"
        style={{
          color: 'var(--primary-700)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          marginTop: 'auto',
        }}
      >
        <span>Explore services</span>
        <ArrowRight size={13} strokeWidth={2.2} />
      </span>
    </Link>
  );
};
