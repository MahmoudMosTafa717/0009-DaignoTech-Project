// // AdminSettings.js
// import React from "react";

// const AdminSettings = ({ selectedView }) => {
//   const adminProfileData = {
//     fullName: "Mohamed Mostafa",
//     email: "admin@diagnotech.com",
//     role: "System Administrator",
//     avatar: "https://i.pravatar.cc/100?img=12",
//   };

//   return (
//     <div className="p-4 w-100">
//       {selectedView === "myProfile" && (
//         <div className="card shadow p-4" style={{ maxWidth: "600px" }}>
//           <div className="d-flex align-items-center mb-4">
//             <img
//               src={adminProfileData.avatar}
//               alt="Admin Avatar"
//               className="rounded-circle me-3"
//               width="80"
//               height="80"
//             />
//             <div>
//               <h4 className="mb-1">{adminProfileData.fullName}</h4>
//               <p className="mb-0 text-muted">{adminProfileData.role}</p>
//             </div>
//           </div>
//           <div>
//             <p><strong>Email:</strong> {adminProfileData.email}</p>
//             <p><strong>Role:</strong> {adminProfileData.role}</p>
//           </div>
//         </div>
//       )}

//       {selectedView === "updateProfile" && <h3>Update Profile Info (Coming Soon...)</h3>}
//       {selectedView === "changePassword" && <h3>Change Password (Coming Soon...)</h3>}
//       {selectedView === "deleteAccount" && <h3>Delete Account (Coming Soon...)</h3>}
//     </div>
//   );
// };

// export default AdminSettings;
