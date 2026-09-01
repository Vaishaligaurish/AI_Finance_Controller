import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ message, actionText, actionLink }) => (
  <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm border border-gray-200">
    <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
    {actionText && (
      <Link to={actionLink} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        {actionText}
      </Link>
    )}
  </div>
);
export default EmptyState;
