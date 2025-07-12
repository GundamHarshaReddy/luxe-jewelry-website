import React, { useState } from 'react';
import { User, Mail, Phone } from 'lucide-react';
import { Input } from '../ui/Input';

interface CustomerDetailsFormProps {
  onCustomerInfoChange: (customerInfo: {
    name: string;
    email: string;
    phone: string;
  }) => void;
  initialValues?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({
  onCustomerInfoChange,
  initialValues = {}
}) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: initialValues.name || '',
    email: initialValues.email || '',
    phone: initialValues.phone || ''
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'name':
        return value.length < 2 ? 'Name must be at least 2 characters' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address' : '';
      case 'phone':
        const phoneRegex = /^[6-9]\d{9}$/;
        return !phoneRegex.test(value) ? 'Please enter a valid 10-digit mobile number' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (field: keyof typeof customerInfo, value: string) => {
    const updatedInfo = { ...customerInfo, [field]: value };
    setCustomerInfo(updatedInfo);

    // Validate field
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));

    // Call parent callback
    onCustomerInfoChange(updatedInfo);
  };

  const isFormValid = () => {
    return (
      customerInfo.name.length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email) &&
      /^[6-9]\d{9}$/.test(customerInfo.phone) &&
      !Object.values(errors).some(error => error)
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Details</h3>
      
      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <User size={16} className="inline mr-2" />
          Full Name *
        </label>
        <Input
          type="text"
          value={customerInfo.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter your full name"
          className={`w-full ${errors.name ? 'border-red-500' : ''}`}
          required
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Mail size={16} className="inline mr-2" />
          Email Address *
        </label>
        <Input
          type="email"
          value={customerInfo.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter your email address"
          className={`w-full ${errors.email ? 'border-red-500' : ''}`}
          required
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      {/* Phone Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Phone size={16} className="inline mr-2" />
          Mobile Number *
        </label>
        <Input
          type="tel"
          value={customerInfo.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="Enter your 10-digit mobile number"
          className={`w-full ${errors.phone ? 'border-red-500' : ''}`}
          maxLength={10}
          required
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Form Status */}
      <div className="flex items-center space-x-2 text-sm">
        {isFormValid() ? (
          <div className="text-green-600 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            All details are valid
          </div>
        ) : (
          <div className="text-gray-500 flex items-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
            Please fill all required fields
          </div>
        )}
      </div>
    </div>
  );
};
