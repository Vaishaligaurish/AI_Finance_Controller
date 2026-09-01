import React from 'react';

const StatusBadge = ({ status }) => {
  let color = 'bg-gray-100 text-gray-800';
  if (status === 'AUTO_MATCH' || status === 'COMPLETED') color = 'bg-green-100 text-green-800';
  if (status === 'REVIEW_REQUIRED' || status === 'PROCESSING') color = 'bg-yellow-100 text-yellow-800';
  if (status === 'UNRESOLVED_EXCEPTION' || status === 'FAILED') color = 'bg-red-100 text-red-800';

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
};
export default StatusBadge;
