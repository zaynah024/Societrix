import React from "react";
import { getPriorityBadgeClass } from '../../lib/utils';
import { formatDate } from '../../lib/utils';

const AnnouncementItem = ({ announcement }) => {
  const priorityClass = getPriorityBadgeClass(announcement.priority);
  
  return (
    <div className="announcement">
      <div className="announcement-header">
        <div>
          <h2 className="announcement-title">{announcement.title}</h2>
          <p className="announcement-meta">
            {formatDate(new Date(announcement.date))} • By {announcement.author}
          </p>
        </div>
        <span className={priorityClass}>
          {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
        </span>
      </div>
      <p className="announcement-content">{announcement.content}</p>
    </div>
  );
};

export default AnnouncementItem;
