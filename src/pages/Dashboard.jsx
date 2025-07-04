// // import React, { useEffect, useState } from "react";

// // const Dashboard = () => {
// //   const [totalDocs, setTotalDocs] = useState(0);
// //   const [signedDocs, setSignedDocs] = useState(0);
// //   const [pendingDocs, setPendingDocs] = useState(0);

// //   useEffect(() => {
// //     const user = JSON.parse(localStorage.getItem("user"));
// //     const email = user?.email;

// //     const allDocs = JSON.parse(localStorage.getItem("documents")) || [];

// //     const userDocs = allDocs.filter(doc => doc.user === email);

// //     setTotalDocs(userDocs.length);
// //     setSignedDocs(userDocs.filter(doc => doc.signed === true).length);
// //     setPendingDocs(userDocs.filter(doc => doc.signed === false).length);
// //   }, []);

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
// //       {/* Header */}
// //       <div className="flex flex-col items-center py-8">
// //         <img src="/docseal-logo.png" alt="DocSeal Logo" className="w-16 h-16 mb-3" />
// //         <h1 className="text-4xl font-bold text-gray-800">DocSeal</h1>
// //         <p className="text-sm text-gray-500 mt-1">Secure Digital Signatures</p>
// //       </div>

// //       {/* Cards */}
// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-12">
// //         <DashboardCard title="Total Documents" count={totalDocs} color="blue" icon="📄" />
// //         <DashboardCard title="Signed Documents" count={signedDocs} color="green" icon="✅" />
// //         <DashboardCard title="Pending Documents" count={pendingDocs} color="yellow" icon="🕓" />
// //       </div>
// //     </div>
// //   );
// // };

// // const DashboardCard = ({ title, count, color, icon }) => {
// //   const colorClasses = {
// //     blue: "bg-blue-100 text-blue-600 border-blue-500",
// //     green: "bg-green-100 text-green-600 border-green-500",
// //     yellow: "bg-yellow-100 text-yellow-600 border-yellow-500",
// //   };

// //   return (
// //     <div className={`bg-white border-l-4 ${colorClasses[color].split(" ").pop()} rounded-2xl shadow-md p-6`}>
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <p className="text-gray-500 text-sm">{title}</p>
// //           <h3 className="text-3xl font-bold text-gray-800">{count}</h3>
// //         </div>
// //         <div className={`rounded-full p-3 text-xl ${colorClasses[color]}`}>
// //           {icon}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;
// import React, { useEffect, useState } from "react";

// const Dashboard = () => {
//   const [uploadCount, setUploadCount] = useState(0);
//   const [signedCount, setSignedCount] = useState(0);
//   const [pendingCount, setPendingCount] = useState(0);

//   useEffect(() => {
//   const fetchStats = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/dashboard/stats", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ Secure way
//         },
//       });

//       const data = await res.json();
//       setUploadCount(data.total);
//       setSignedCount(data.signed);
//       setPendingCount(data.pending);
//     } catch (err) {
//       console.error("Error fetching dashboard stats", err);
//     }
//   };

//   fetchStats();
// }, []);

//   return (
//     <div className="p-10">
//       <h2 className="text-3xl font-semibold mb-6">Dashboard</h2>
//       <div className="grid grid-cols-3 gap-6">
//         <div className="bg-blue-200 p-6 rounded-lg shadow text-center">
//           <h3 className="text-xl font-semibold">Uploaded Documents</h3>
//           <p className="text-4xl font-bold mt-2">{uploadCount}</p>
//         </div>
//         <div className="bg-green-200 p-6 rounded-lg shadow text-center">
//           <h3 className="text-xl font-semibold">Signed Documents</h3>
//           <p className="text-4xl font-bold mt-2">{signedCount}</p>
//         </div>
//         <div className="bg-yellow-200 p-6 rounded-lg shadow text-center">
//           <h3 className="text-xl font-semibold">Pending Documents</h3>
//           <p className="text-4xl font-bold mt-2">{pendingCount}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [counts, setCounts] = useState({ uploaded: 0, signed: 0, pending: 0 });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email;

    if (email) {
      const uploadedDocs = JSON.parse(localStorage.getItem("uploadedDocs")) || {};
      const signedDocs = JSON.parse(localStorage.getItem("signedDocs")) || {};

      const uploaded = uploadedDocs[email] || 0;
      const signed = signedDocs[email] || 0;
      const pending = uploaded - signed;

      setCounts({ uploaded, signed, pending: pending < 0 ? 0 : pending });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-400 to-indigo-500">
      <div className="bg-white p-10 rounded-lg shadow-xl text-center w-96">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">📊 Dashboard</h2>

        <div className="space-y-4">
          <div className="bg-blue-100 text-blue-800 py-3 px-6 rounded-lg font-semibold">
            Uploaded Documents: {counts.uploaded}
          </div>
          <div className="bg-green-100 text-green-800 py-3 px-6 rounded-lg font-semibold">
            Signed Documents: {counts.signed}
          </div>
          <div className="bg-yellow-100 text-yellow-800 py-3 px-6 rounded-lg font-semibold">
            Pending Signatures: {counts.pending}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


