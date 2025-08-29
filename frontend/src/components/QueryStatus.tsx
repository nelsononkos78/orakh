import React from 'react'
import type { QueryStatus } from '../services/queryService'

interface QueryStatusProps {
  status: QueryStatus
  onRegisterClick: () => void
}

const QueryStatusComponent: React.FC<QueryStatusProps> = ({ status, onRegisterClick }) => {
  const getStatusColor = () => {
    if (status.remaining === 0) return 'text-red-500'
    if (status.remaining <= 2) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getStatusIcon = () => {
    if (status.remaining === 0) return '🔴'
    if (status.remaining <= 2) return '🟡'
    return '🟢'
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-2 shadow-lg">
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${getStatusColor()}`}>
            {getStatusIcon()}
          </span>
          <span className="text-xs text-gray-600">
            {status.remaining}/{status.limit}
          </span>
        </div>
      </div>
    </div>
  )
}

export default QueryStatusComponent 