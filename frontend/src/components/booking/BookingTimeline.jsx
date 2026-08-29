import React from 'react';
import { Check } from 'lucide-react';

export const BookingTimeline = ({ timeline = [], currentStatus }) => {
  return (
    <div className="timeline">
      {timeline.map((item, index) => {
        const isDone = item.done;
        const isActive = !item.done && timeline[index - 1]?.done;

        return (
          <div
            key={index}
            className={`timeline-item ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
          >
            <div className="timeline-marker">
              {isDone ? <Check size={12} strokeWidth={3} /> : index + 1}
            </div>
            <div className="timeline-content">
              <div className="flex items-center justify-between">
                <h5>{item.step}</h5>
                <span className="timeline-time">{item.time}</span>
              </div>
              <p>{item.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
