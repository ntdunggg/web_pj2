import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Spinner = ({ className, size = 'md' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-2',
  };

  return (
    <div className={cn('animate-spin rounded-full border-primary-600 border-t-transparent', sizes[size], className)} />
  );
};

export const LoadingOverlay = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-6 flex flex-col items-center gap-4 max-w-sm w-full">
        <Spinner size="lg" />
        <p className="text-gray-900 font-medium">{message}</p>
      </div>
    </div>
  );
};
