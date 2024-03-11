import { useMutation } from '@tanstack/react-query';

export const LoginButton = () => {
  const loginMutation = useMutation({
    mutationFn: () =>
      fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
      }),
    onSuccess: () => {
      // Logout successful, perform any necessary actions (e.g., clear user data, redirect)
      console.log('Login successful');
    },
    onError: (error) => {
      // Handle error if the logout request fails
      console.error('Login failed:', error);
    },
  });

  const handleLogout = async () => {
    loginMutation.mutate();
  };

  if (loginMutation.isPending) {
    return <div>Logging ...</div>;
  }

  if (loginMutation.isError) {
    return <div>Error: {loginMutation.error.message}</div>;
  }

  return (
    <button onClick={handleLogout} disabled={loginMutation.isPending}>
      Login 2.0
    </button>
  );
};
