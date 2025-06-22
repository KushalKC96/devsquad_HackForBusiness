const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper function to get auth token from localStorage (client-side only)
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role?: 'guest' | 'host';  }) => apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials: { email: string; password: string }) =>
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getProfile: () => apiRequest('/api/auth/profile'),
};

// Properties API
export const propertiesAPI = {
  getAll: (filters?: {
    page?: number;
    limit?: number;
    city?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    maxGuests?: number;
  }) => {
    const queryString = filters ? new URLSearchParams(
      Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = value.toString();
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString() : '';
      return apiRequest(`/api/properties${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: string | number) => apiRequest(`/api/properties/${id}`),

  create: (propertyData: any) =>
    apiRequest('/api/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    }),

  update: (id: string | number, propertyData: any) =>
    apiRequest(`/api/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    }),

  delete: (id: string | number) =>
    apiRequest(`/api/properties/${id}`, {
      method: 'DELETE',
    }),
};

// Long-Term Contracts API
export const contractsAPI = {
  create: (contractData: {
    property_id: number;
    start_date: string;
    end_date: string;
    monthly_rent: number;
    security_deposit?: number;
    fine_amount?: number;
    terms_and_conditions?: string;
    is_renewable?: boolean;
  }) =>
    apiRequest('/api/contracts', {
      method: 'POST',
      body: JSON.stringify(contractData),
    }),

  getById: (id: string | number) => apiRequest(`/api/contracts/${id}`),

  getAll: (filters?: {
    userId?: number;
    status?: string;
    role?: 'customer' | 'host';
  }) => {
    const queryString = filters ? new URLSearchParams(
      Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = value.toString();
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString() : '';
    return apiRequest(`/api/contracts${queryString ? `?${queryString}` : ''}`);
  },

  terminate: (id: string | number, termination_reason: string) =>
    apiRequest(`/api/contracts/${id}/terminate`, {
      method: 'PATCH',
      body: JSON.stringify({ termination_reason }),
    }),

  approve: (id: string | number) =>
    apiRequest(`/api/contracts/${id}/approve`, {
      method: 'PATCH',
    }),

  update: (id: string | number, updateData: {
    terms_and_conditions?: string;
    is_renewable?: boolean;
  }) =>
    apiRequest(`/api/contracts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    }),
};

// Bookings API
export const bookingsAPI = {
  create: (bookingData: {
    propertyId: number;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    notes?: string;  }) => apiRequest('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),

  getAll: (filters?: { status?: string; page?: number; limit?: number }) => {
    const queryString = filters ? new URLSearchParams(
      Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = value.toString();
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString() : '';
    
    return apiRequest(`/api/bookings${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: string | number) => apiRequest(`/api/bookings/${id}`),

  cancel: (id: string | number) =>
    apiRequest(`/api/bookings/${id}/cancel`, {
      method: 'PUT',
    }),
};

// Reviews API
export const reviewsAPI = {
  create: (reviewData: {
    propertyId: number;
    rating: number;
    comment: string;  }) => apiRequest('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }),

  getByProperty: (propertyId: string | number, page?: number) =>    apiRequest(`/api/reviews/property/${propertyId}${page ? `?page=${page}` : ''}`),

  getUserReviews: (page?: number) =>
    apiRequest(`/api/reviews/user${page ? `?page=${page}` : ''}`),

  update: (id: string | number, reviewData: { rating: number; comment: string }) =>
    apiRequest(`/api/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    }),

  delete: (id: string | number) =>
    apiRequest(`/api/reviews/${id}`, {
      method: 'DELETE',
    }),
};

// Company API
export const companyAPI = {
  getInfo: () => apiRequest('/api/company'),
  getAbout: () => apiRequest('/api/company/about'),
};

// Careers API
export const careersAPI = {
  getJobs: (filters?: { department?: string; location?: string; type?: string }) => {
    const queryString = filters ? new URLSearchParams(
      Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = value.toString();
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString() : '';
      return apiRequest(`/api/careers${queryString ? `?${queryString}` : ''}`);
  },

  getJobById: (id: string | number) => apiRequest(`/api/careers/${id}`),

  apply: (applicationData: {
    jobId: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    coverLetter: string;
    resumeUrl: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
  }) => apiRequest('/api/careers/apply', {
    method: 'POST',
    body: JSON.stringify(applicationData),
  }),
};

// Referrals API
export const referralsAPI = {
  getInfo: () => apiRequest('/api/referrals/info'),
  getMyCode: () => apiRequest('/api/referrals/my-code'),
  sendReferral: (referralData: {
    refereeEmail: string;
    refereeName: string;
    message?: string;
  }) => apiRequest('/api/referrals/send', {
    method: 'POST',
    body: JSON.stringify(referralData),
  }),
  getMyReferrals: (page?: number, status?: string) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (status) params.append('status', status);
    return apiRequest(`/api/referrals/my-referrals${params.toString() ? `?${params.toString()}` : ''}`);
  },
  validateCode: (referralCode: string) => apiRequest('/api/referrals/validate', {
    method: 'POST',
    body: JSON.stringify({ referralCode }),
  }),
};

// Safety API
export const safetyAPI = {
  getGuidelines: () => apiRequest('/api/safety/guidelines'),
  reportIssue: (reportData: {
    type: 'safety_concern' | 'inappropriate_behavior' | 'property_issue' | 'other';
    propertyId?: number;
    bookingId?: number;
    subject: string;
    description: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    evidence?: string[];
  }) => apiRequest('/api/safety/report', {
    method: 'POST',
    body: JSON.stringify(reportData),
  }),
  getMyReports: (page?: number, status?: string) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (status) params.append('status', status);
    return apiRequest(`/api/safety/my-reports${params.toString() ? `?${params.toString()}` : ''}`);
  },
  getReport: (caseNumber: string) => apiRequest(`/api/safety/report/${caseNumber}`),
};

// User API
export const userAPI = {
  getProfile: () => apiRequest('/api/users/profile'),
  updateProfile: (profileData: {
    firstName: string;
    lastName: string;
    phone?: string;
  }) => apiRequest('/api/users/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),
};

// Payments API
export const paymentsAPI = {
  createIntent: (paymentData: {
    propertyId: number;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalAmount: number;
    currency?: string;
    paymentMethod: string;
    notes?: string;
  }) => apiRequest('/api/payments/create-intent', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  }),

  confirmPayment: (confirmData: {
    paymentIntentId: string;
    paymentMethodId?: string;
    paymentProvider: string;
  }) => apiRequest('/api/payments/confirm', {
    method: 'POST',
    body: JSON.stringify(confirmData),
  }),

  getHistory: (filters?: { page?: number; limit?: number }) => {
    const queryString = filters ? new URLSearchParams(
      Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = value.toString();
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString() : '';
    
    return apiRequest(`/api/payments/history${queryString ? `?${queryString}` : ''}`);
  },
};
