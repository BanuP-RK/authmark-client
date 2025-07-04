// // import { Link, useNavigate } from 'react-router-dom';

// // const Navbar = () => {
// //   const navigate = useNavigate();
// //   const token = localStorage.getItem("token");

// //   const handleLogout = () => {
// //     localStorage.removeItem("token");
// //     navigate("/login");
// //   };

// //   return (
// //     <nav className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between">
    
// //   <img src="/docseal-logo.png" alt="DocSeal Logo" className="w-12 h-12" />
// //   <h1 className="text-3xl font-bold ml-10">AuthMark</h1>

// //       <div className="ml-auto flex items-center space-x-4">
// //         {!token && (
// //           <>
// //             <Link to="/register" className="hover:underline">Register</Link>
// //             <Link to="/login" className="hover:underline">Login</Link>
// //           </>
// //         )}
// //         {token && (
// //           <>
// //             <Link to="/dashboard" className="hover:underline">Dashboard</Link>
// //             <Link to="/upload" className="hover:underline">Upload</Link>
// //             <button
// //               onClick={handleLogout}
// //               className="bg-red-500 px-4 py-1 rounded hover:bg-red-600 ml-2"
// //             >
// //               Logout
// //             </button>
// //           </>
// //         )}
// //       </div>
// //     </nav>
// //   );
// // };

// // export default Navbar;

// import { Link, useNavigate } from 'react-router-dom';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("user")); // ✅ Get user from localStorage
//   const email = user?.email;

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user"); // ✅ Clear user info on logout
//     navigate("/login");
//   };

//   return (
//     <nav className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between">
//       <div className="flex items-center">
//         <img src="/docseal-logo.png" alt="DocSeal Logo" className="w-12 h-12" />
//         <h1 className="text-3xl font-bold ml-4">AuthMark</h1>
//       </div>

//       <div className="ml-auto flex items-center space-x-6">
//         {email && <span className="text-sm text-white bg-blue-900 px-3 py-1 rounded">{email}</span>}
        
//         {!token ? (
//           <>
//             <Link to="/register" className="hover:underline">Register</Link>
//             <Link to="/login" className="hover:underline">Login</Link>
//           </>
//         ) : (
//           <>
//             <Link to="/dashboard" className="hover:underline">Dashboard</Link>
//             <Link to="/upload" className="hover:underline">Upload</Link>
//             <button
//               onClick={handleLogout}
//               className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
//             >
//               Logout
//             </button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
      <div className="text-xl font-bold">Signature App</div>
      <div className="flex items-center gap-4">
        {token && (
          <>
            <Link to="/upload" className="hover:underline">Upload</Link>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <span className="text-sm text-white bg-blue-800 px-2 py-1 rounded">
              {user?.email}
            </span>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
              Logout
            </button>
          </>
        )}
        {!token && (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
