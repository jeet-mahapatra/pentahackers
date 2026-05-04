// pages/Auth/AdminLogin.jsx

const AdminLogin = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>

        <input
          type="email"
          placeholder="Admin Email"
          className="w-full mb-3 p-2 rounded text-black"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 rounded text-black"
        />

        <button className="w-full bg-red-500 p-2 rounded">
          Login
        </button>
      </div>

    </div>
  );
};

export {AdminLogin};