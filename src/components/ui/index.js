import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  fullWidth = false,
  className = '',
  loading = false,
  icon, 
  iconPosition = 'right',
  ...props 
}) => {
  // Variant styles
  const variantClasses = {
    primary: 'bg-tutorTeal text-white hover:bg-tutorTeal/90',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'bg-transparent border border-tutorTeal text-tutorTeal hover:bg-tutorTeal/10',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-green-500 text-white hover:bg-green-600',
  };

  // Size styles
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg',
  };

  // Width styles
  const widthClass = fullWidth ? 'w-full' : '';

  // Base classes
  const baseClasses = 'font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tutorTeal transition-all duration-200 inline-flex items-center justify-center shadow-sm disabled:opacity-70 disabled:cursor-not-allowed';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && !loading && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export const Input = ({
  label,
  id,
  type = 'text',
  error,
  icon,
  helpText,
  className = '',
  containerClassName = '',
  fullWidth = true,
  ...props
}) => {
  // Width styles
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          id={id}
          className={`
            ${widthClass}
            ${icon ? 'pl-10' : 'pl-4'} 
            pr-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} 
            rounded-lg shadow-sm focus:outline-none focus:ring-tutorTeal focus:border-tutorTeal 
            transition-all duration-200
            ${className}
          `}
          {...props}
        />
      </div>
      {helpText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export const Checkbox = ({
  label,
  id,
  checked,
  onChange,
  className = '',
  ...props
}) => {
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-tutorTeal focus:ring-tutorTeal border-gray-300 rounded"
        {...props}
      />
      {label && (
        <label htmlFor={id} className="ml-2 block text-sm text-gray-700">
          {label}
        </label>
      )}
    </div>
  );
};

export const Select = ({
  label,
  id,
  options,
  error,
  helpText,
  className = '',
  containerClassName = '',
  fullWidth = true,
  ...props
}) => {
  // Width styles
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={`
            ${widthClass}
            pl-4 pr-8 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} 
            rounded-lg shadow-sm focus:outline-none focus:ring-tutorTeal focus:border-tutorTeal 
            transition-all duration-200 appearance-none
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
      {helpText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export const Textarea = ({
  label,
  id,
  error,
  helpText,
  className = '',
  containerClassName = '',
  fullWidth = true,
  ...props
}) => {
  // Width styles
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`
          ${widthClass}
          px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} 
          rounded-lg shadow-sm focus:outline-none focus:ring-tutorTeal focus:border-tutorTeal 
          transition-all duration-200
          ${className}
        `}
        {...props}
      />
      {helpText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export const Card = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  bodyClassName = '',
  headerClassName = '',
  footerClassName = '',
  ...props
}) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className={`p-6 ${headerClassName}`}>
          {title && <h3 className="font-bold text-lg text-gray-800">{title}</h3>}
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
      )}
      <div className={`p-6 ${!title && !subtitle ? '' : 'pt-0'} ${bodyClassName}`}>
        {children}
      </div>
      {footer && (
        <div className={`p-6 pt-0 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export const Alert = ({
  children,
  variant = 'info',
  title,
  icon,
  className = '',
  ...props
}) => {
  // Variant styles
  const variantClasses = {
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    success: 'bg-green-100 border-green-400 text-green-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    error: 'bg-red-100 border-red-400 text-red-700',
  };

  return (
    <div 
      className={`border-l-4 p-4 rounded relative ${variantClasses[variant]} ${className}`}
      role="alert"
      {...props}
    >
      <div className="flex">
        {icon && (
          <div className="py-1 mr-3">
            {icon}
          </div>
        )}
        <div>
          {title && <p className="font-medium">{title}</p>}
          <div className={title ? 'mt-1' : ''}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  className = '',
  ...props
}) => {
  // Variant styles
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-tutorTeal/10 text-tutorTeal',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    premium: 'bg-amber-100 text-amber-800',
  };

  // Size styles
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  // Rounded styles
  const roundedClass = rounded ? 'rounded-full' : 'rounded';

  return (
    <span 
      className={`inline-flex items-center font-semibold ${variantClasses[variant]} ${sizeClasses[size]} ${roundedClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export const Avatar = ({ 
  src, 
  alt, 
  size = 'md', 
  icon, 
  className = '' 
}) => {
  // Size styles
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    xxl: 'w-24 h-24',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center ${!src ? 'bg-tutorTeal/10' : ''} ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : icon ? (
        icon
      ) : (
        <span className="text-tutorTeal">{alt?.charAt(0)?.toUpperCase()}</span>
      )}
    </div>
  );
};

export const Tab = ({ 
  tabs, 
  activeTab, 
  onChange, 
  variant = 'default', 
  className = '' 
}) => {
  // Variant styles
  const variantStyles = {
    default: {
      container: 'border-b border-gray-200',
      tab: 'py-4 px-1 text-center border-b-2',
      active: 'border-tutorTeal text-tutorTeal',
      inactive: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
    },
    pills: {
      container: 'flex space-x-2',
      tab: 'py-2 px-4 rounded-lg',
      active: 'bg-tutorTeal text-white',
      inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    },
    buttons: {
      container: 'bg-gray-100 p-1 rounded-lg',
      tab: 'py-2 px-4 rounded-md',
      active: 'bg-white shadow',
      inactive: 'text-gray-500 hover:text-gray-900',
    },
  };

  const style = variantStyles[variant];

  return (
    <div className={className}>
      <div className={`flex space-x-8 ${style.container}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`${style.tab} ${
              activeTab === tab.id ? style.active : style.inactive
            } font-medium text-sm transition-all duration-200 flex-1`}
          >
            <div className="flex items-center justify-center">
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'md',
  closeOnOutsideClick = true,
  className = '' 
}) => {
  if (!isOpen) return null;

  // Size styles
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  const handleBackdropClick = (e) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-lg shadow-xl overflow-hidden ${sizeClasses[size]} w-full ${className}`}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
        {footer && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const Table = ({ 
  columns, 
  data, 
  emptyMessage = "No data available", 
  isLoading = false,
  className = ''
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th 
                key={column.key}
                scope="col" 
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center">
                <div className="flex justify-center items-center">
                  <svg className="animate-spin h-5 w-5 text-tutorTeal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="ml-2">Loading...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex}>
                {columns.map((column) => (
                  <td key={`${rowIndex}-${column.key}`} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};