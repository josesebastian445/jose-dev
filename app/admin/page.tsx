"use client";

import { useState, useEffect } from "react";

type AuditRequest = {
  _id: string;
  name: string;
  email: string;
  website: string;
  message?: string;
  submittedAt: string;
  ipAddress: string;
};

type ContactSubmission = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  ipAddress: string;
};

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"audits" | "contacts">("audits");
  const [auditRequests, setAuditRequests] = useState<AuditRequest[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const credentials = Buffer.from(`${username}:${password}`).toString("base64");

      const response = await fetch("/api/admin/audit-requests", {
        headers: {
          Authorization: `Basic ${credentials}`
        }
      });

      if (response.ok) {
        setAuthenticated(true);
        localStorage.setItem("adminAuth", credentials);
        await fetchData(credentials);
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (credentials?: string) => {
    const authCreds = credentials || localStorage.getItem("adminAuth");
    if (!authCreds) return;

    try {
      const [auditsRes, contactsRes] = await Promise.all([
        fetch("/api/admin/audit-requests", {
          headers: { Authorization: `Basic ${authCreds}` }
        }),
        fetch("/api/admin/contact-submissions", {
          headers: { Authorization: `Basic ${authCreds}` }
        })
      ]);

      if (auditsRes.ok) {
        const auditsData = await auditsRes.json();
        setAuditRequests(auditsData.data || []);
      }

      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        setContactSubmissions(contactsData.data || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    const savedAuth = localStorage.getItem("adminAuth");
    if (savedAuth) {
      setAuthenticated(true);
      fetchData(savedAuth);
    }
  }, []);

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem("adminAuth");
    setUsername("");
    setPassword("");
    setAuditRequests([]);
    setContactSubmissions([]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#05060d] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-white/60">Sign in to view submissions</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-white"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-white"
                  placeholder="Enter password"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05060d] text-white">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Audit Requests</p>
                <p className="text-3xl font-bold text-cyan-400">{auditRequests.length}</p>
              </div>
              <div className="bg-cyan-500/20 p-4 rounded-xl">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Contact Submissions</p>
                <p className="text-3xl font-bold text-blue-400">{contactSubmissions.length}</p>
              </div>
              <div className="bg-blue-500/20 p-4 rounded-xl">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab("audits")}
              className={`flex-1 px-6 py-4 font-medium transition-all ${
                activeTab === "audits"
                  ? "bg-cyan-500/20 text-cyan-400 border-b-2 border-cyan-400"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              Audit Requests ({auditRequests.length})
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              className={`flex-1 px-6 py-4 font-medium transition-all ${
                activeTab === "contacts"
                  ? "bg-blue-500/20 text-blue-400 border-b-2 border-blue-400"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              Contact Submissions ({contactSubmissions.length})
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === "audits" ? (
              <div className="space-y-4">
                {auditRequests.length === 0 ? (
                  <p className="text-center text-white/60 py-12">No audit requests yet</p>
                ) : (
                  auditRequests.map((request) => (
                    <div
                      key={request._id}
                      className="bg-black/30 border border-white/10 rounded-lg p-5 hover:border-cyan-500/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-cyan-400">{request.name}</h3>
                          <p className="text-white/60 text-sm">{request.email}</p>
                        </div>
                        <span className="text-xs text-white/40 bg-black/30 px-3 py-1 rounded-full">
                          {formatDate(request.submittedAt)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-white/60 text-sm">Website:</span>
                          <a
                            href={request.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 text-sm underline"
                          >
                            {request.website}
                          </a>
                        </div>
                        {request.message && (
                          <div>
                            <span className="text-white/60 text-sm">Message:</span>
                            <p className="text-white/80 text-sm mt-1 bg-black/30 p-3 rounded">
                              {request.message}
                            </p>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <span>IP: {request.ipAddress}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {contactSubmissions.length === 0 ? (
                  <p className="text-center text-white/60 py-12">No contact submissions yet</p>
                ) : (
                  contactSubmissions.map((submission) => (
                    <div
                      key={submission._id}
                      className="bg-black/30 border border-white/10 rounded-lg p-5 hover:border-blue-500/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-blue-400">{submission.name}</h3>
                          <p className="text-white/60 text-sm">{submission.email}</p>
                        </div>
                        <span className="text-xs text-white/40 bg-black/30 px-3 py-1 rounded-full">
                          {formatDate(submission.submittedAt)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-white/60 text-sm">Subject:</span>
                          <p className="text-white/80 font-medium">{submission.subject}</p>
                        </div>
                        <div>
                          <span className="text-white/60 text-sm">Message:</span>
                          <p className="text-white/80 text-sm mt-1 bg-black/30 p-3 rounded">
                            {submission.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <span>IP: {submission.ipAddress}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
