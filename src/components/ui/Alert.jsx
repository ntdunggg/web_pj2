import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Alert = ({ children, variant = 'info', className, ...props }) => {
  const variants = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: <Info className="h-5 w-5 text-blue-600" />,
    },
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: <XCircle className="h-5 w-5 text-red-600" />,
    },
  };

  const { container, icon } = variants[variant];

  return (
    <div
      className={cn('flex items-start gap-3 p-4 border border-l-4 rounded-lg', container, className)}
      {...props}
    >
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1">{children}</div>
    </div>
  );
};
