import { useMutation } from '@tanstack/react-query';

export const LogoutButton = () => {
  const logoutMutation = useMutation({
    mutationFn: () =>
      fetch('http://127.0.0.1:5000/api/logout', {
        method: 'POST',
      }),
    onSuccess: () => {
      // Logout successful, perform any necessary actions (e.g., clear user data, redirect)
      console.log('Logout successful');
    },
    onError: (error) => {
      // Handle error if the logout request fails
      console.error('Logout failed:', error);
    },
  });

  const handleLogout = async () => {
    logoutMutation.mutate();
  };

  if (logoutMutation.isPending) {
    return <div>Logging out...</div>;
  }

  if (logoutMutation.isError) {
    return <div>Error: {logoutMutation.error.message}</div>;
  }

  return (
    <button onClick={handleLogout} disabled={logoutMutation.isPending}>
      Logout
    </button>
  );
};
