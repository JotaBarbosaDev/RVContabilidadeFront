import { useContext } from 'react';
import { AdminContext } from '../contexts/AdminContext';

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    console.warn('useAdmin: AdminContext is null, returning default values');
    return {
      pendingRequests: [],
      allRequests: [],
      currentRequest: null,
      users: [],
      currentUser: null,
      isLoadingRequests: false,
      isLoadingUsers: false,
      fetchPendingRequests: () => Promise.resolve(),
      fetchAllRequests: () => Promise.resolve(),
      fetchRequestDetails: () => Promise.resolve(),
      approveRequest: () => Promise.resolve(),
      fetchUsers: () => Promise.resolve(),
      fetchUserDetails: () => Promise.resolve(),
      updateUserStatus: () => Promise.resolve(),
      requestFilters: {},
      setRequestFilters: () => {},
      userFilters: {},
      setUserFilters: () => {},
    };
  }
  return context;
};
