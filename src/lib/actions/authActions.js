// Function to handle login, save token and user id to local storage
export const onLogin = async ({ id, token }) => {
  localStorage.setItem('token', token);
  localStorage.setItem('userId', id);
};

// Function to fetch user details using token
export const getUserDetails = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

   const response = await fetch('/api/user/details', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Failed to fetch user details');

  return await response.json();
};

// Function to clear local storage
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
