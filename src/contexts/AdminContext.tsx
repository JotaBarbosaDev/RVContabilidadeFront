import { createContext, useState } from 'react';
import type { ReactNode } from 'react';

interface RequestData {
  // Common
  accessType?: string;
  businessType?: string;
  businessTypeOther?: string;
  accountingRegime?: string;
  estimatedRevenue?: string;
  monthlyDocuments?: string;
  documentDelivery?: string;
  invoicingTool?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  observations?: string;
  hasActivity?: string;
  hasSocialSecurity?: string;
  hasEmployees?: string;
  hasDebts?: string;
  documents?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  [key: string]: unknown;
}

interface Request {
  id: string;
  type: 'existing-client' | 'new-client';
  status: 'pending' | 'approved' | 'rejected';
  clientType: string;
  name: string;
  nif: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  data: RequestData;
}

interface User {
  id: string;
  name: string;
  email: string;
  nif: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  role: 'client' | 'admin';
  createdAt: string;
  lastLogin?: string;
}

interface AdminContextType {
  // Requests
  pendingRequests: Request[];
  allRequests: Request[];
  currentRequest: Request | null;
  
  // Users
  users: User[];
  currentUser: User | null;
  
  // Loading states
  isLoadingRequests: boolean;
  isLoadingUsers: boolean;
  
  // Functions
  fetchPendingRequests: () => Promise<void>;
  fetchAllRequests: () => Promise<void>;
  fetchRequestDetails: (id: string) => Promise<void>;
  approveRequest: (id: string, approved: boolean, notes?: string) => Promise<void>;
  
  fetchUsers: () => Promise<void>;
  fetchUserDetails: (id: string) => Promise<void>;
  updateUserStatus: (id: string, status: string) => Promise<void>;
  
  // Filters and pagination
  requestFilters: {
    status?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
  };
  setRequestFilters: (filters: {
    status?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => void;
  
  userFilters: {
    status?: string;
    role?: string;
    search?: string;
  };
  setUserFilters: (filters: {
    status?: string;
    role?: string;
    search?: string;
  }) => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export { AdminContext };

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [allRequests, setAllRequests] = useState<Request[]>([]);
  const [currentRequest, setCurrentRequest] = useState<Request | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [requestFilters, setRequestFilters] = useState({});
  const [userFilters, setUserFilters] = useState({});

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    console.log('AdminContext: Token from localStorage:', token ? 'Token exists' : 'No token found');
    
    if (!token) {
      console.warn('AdminContext: No auth token found in localStorage');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchPendingRequests = async () => {
    console.log('AdminContext: fetchPendingRequests called');
    setIsLoadingRequests(true);
    try {
      // Tentar primeiro o endpoint específico de pending-requests
      let url = `${API_BASE_URL}/admin/pending-requests`;
      const headers = getAuthHeaders();
      console.log('AdminContext: Making request to:', url);
      
      let response = await fetch(url, { headers });
      console.log('AdminContext: Response status:', response.status);
      
      // Se não funcionar, tentar o endpoint geral de requests
      if (!response.ok) {
        console.log('AdminContext: Trying fallback endpoint /admin/requests');
        url = `${API_BASE_URL}/admin/requests`;
        response = await fetch(url, { headers });
        console.log('AdminContext: Fallback response status:', response.status);
      }
      
      // Se ainda não funcionar, tentar o endpoint de dashboard
      if (!response.ok) {
        console.log('AdminContext: Trying fallback endpoint /admin/dashboard');
        url = `${API_BASE_URL}/admin/dashboard`;
        response = await fetch(url, { headers });
        console.log('AdminContext: Dashboard response status:', response.status);
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('AdminContext: All endpoints failed, error response:', errorText);
        throw new Error(`Failed to fetch pending requests: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('AdminContext: Received data:', data);
      console.log('AdminContext: Data type:', typeof data);
      console.log('AdminContext: Data keys:', Object.keys(data));
      
      let requests = [];
      
      if (Array.isArray(data)) {
        console.log('AdminContext: Data is array, length:', data.length);
        console.log('AdminContext: First item sample:', data[0]);
        requests = data;
      } else if (data.data) {
        console.log('AdminContext: Data has data property:', data.data);
        console.log('AdminContext: Data.data type:', typeof data.data);
        if (Array.isArray(data.data)) {
          console.log('AdminContext: Data.data is array, length:', data.data.length);
          console.log('AdminContext: First data.data item sample:', data.data[0]);
          requests = data.data;
        } else if (data.data.pending_requests && Array.isArray(data.data.pending_requests)) {
          console.log('AdminContext: Using data.data.pending_requests');
          requests = data.data.pending_requests;
        } else if (data.data.requests && Array.isArray(data.data.requests)) {
          console.log('AdminContext: Using data.data.requests');
          requests = data.data.requests;
        }
      } else if (data.requests && Array.isArray(data.requests)) {
        console.log('AdminContext: Using data.requests');
        requests = data.requests;
      } else if (data.pending_requests && Array.isArray(data.pending_requests)) {
        console.log('AdminContext: Using data.pending_requests');
        requests = data.pending_requests;
      }
      
      console.log('AdminContext: Final requests array:', requests);
      setPendingRequests(requests);
    } catch (error) {
      console.error('AdminContext: Error fetching pending requests:', error);
      throw error;
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const fetchAllRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(requestFilters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value as string);
      });

      const response = await fetch(`${API_BASE_URL}/admin/requests?${queryParams}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }
      
      const data = await response.json();
      setAllRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      throw error;
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const fetchRequestDetails = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/requests/${id}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch request details');
      }
      
      const data = await response.json();
      setCurrentRequest(data);
    } catch (error) {
      console.error('Error fetching request details:', error);
      throw error;
    }
  };

  const approveRequest = async (id: string, approved: boolean, notes?: string) => {
    try {
      const requestBody = {
        request_id: Number(id), // ← Convertendo para número como esperado pelo backend
        status: approved ? 'approved' : 'rejected', // ← Usando o formato correto
        review_notes: notes || '' // ← Usando o nome correto do campo
      };

      console.log('AdminContext: Enviando requisição de aprovação:', requestBody);
      console.log('AdminContext: ID original (string):', id, 'ID convertido (number):', Number(id));

      const response = await fetch(`${API_BASE_URL}/admin/approve-request`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody)
      });
      
      console.log('AdminContext: Response status:', response.status);
      console.log('AdminContext: Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('AdminContext: Error response:', errorText);
        throw new Error(`Erro ${response.status}: ${errorText || 'Failed to process request'}`);
      }

      const result = await response.json();
      console.log('AdminContext: Success response:', result);
      
      // Refresh pending requests
      await fetchPendingRequests();
      await fetchAllRequests();
    } catch (error) {
      console.error('AdminContext: Error processing request:', error);
      throw error;
    }
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(userFilters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value as string);
      });

      const response = await fetch(`${API_BASE_URL}/admin/users?${queryParams}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchUserDetails = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      
      const data = await response.json();
      setCurrentUser(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  };

  const updateUserStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user status');
      }
      
      // Refresh users list
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  };

  const value: AdminContextType = {
    // State
    pendingRequests,
    allRequests,
    currentRequest,
    users,
    currentUser,
    isLoadingRequests,
    isLoadingUsers,
    
    // Functions
    fetchPendingRequests,
    fetchAllRequests,
    fetchRequestDetails,
    approveRequest,
    fetchUsers,
    fetchUserDetails,
    updateUserStatus,
    
    // Filters
    requestFilters,
    setRequestFilters,
    userFilters,
    setUserFilters
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
