// Create an object with a single name
const user = {
  name: 'John Doe',
};

export default function route() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-md p-8 mt-36 w-96">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Profile</h1>
          </div>
          <div className="flex items-center">
            <div className="rounded-full bg-gray-300 h-20 w-20 flex items-center justify-center text-gray-600 font-bold text-3xl mr-4">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">User Profile</p>
            </div>
          </div>
          </div>
            
    </div>
  );
}