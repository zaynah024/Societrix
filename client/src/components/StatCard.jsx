import React from "react";
import { Link } from 'wouter';

const StatCard = ({ title, value, icon, linkText, linkUrl }) => {
  return (
    <div className="card stat-card">
      <div className="stat-header">
        <h3 className="stat-title">{title}</h3>
        <div className="stat-icon">{icon}</div>
      </div>
      <div className="stat-value">{value}</div>
      {linkText && linkUrl && (
        <Link href={linkUrl} className="stat-link">
          {linkText}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
      )}
    </div>
  );
};

export default StatCard;
