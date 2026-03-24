import React, { useEffect, useState } from "react";
import { Mail} from "lucide-react";
import { getProfile } from "../../api/api";

function AdminProfile() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    let token = localStorage.getItem("accessToken");
    if (token) token = token.replace(/^"|"$/g, '');

    if (token) {
      getProfile(token)
        .then((res) => setAdmin(res.data))
        .catch((err) => console.error("Admin profile fetch error:", err));
    }
  }, []);

  if (!admin) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-6">
        {/* Profile Avatar */}
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-4xl font-bold">
            {admin.username?.charAt(0) || admin.name?.charAt(0) || "A"}
          </div>

          <h2 className="text-2xl font-semibold mt-4">{admin.username || admin.name}</h2>
          
          <div className="w-full mt-6 space-y-3 text-left">
            <div className="flex items-center gap-3 text-gray-700">
              <Mail size={20} className="text-blue-600" />
              <p>{admin.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
