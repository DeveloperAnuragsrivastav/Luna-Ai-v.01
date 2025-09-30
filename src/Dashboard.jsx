import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/emails")
      .then((res) => res.json())
      .then(setEmails)
      .catch(console.error);
  }, []);

  return (
    <div className="h-screen w-screen bg-[#202222] text-white p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Emails Dashboard</h1>
      {emails.length === 0 ? (
        <p>No emails collected yet.</p>
      ) : (
        <ul className="space-y-2">
          {emails.map((email, i) => (
            <li key={i} className="p-2 bg-gray-800 rounded">
              {email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
