import React, { useState, useEffect } from "react";
import { UserProfile } from "../types";
import {
  User,
  Mail,
  Lock,
  Building2,
  Compass,
  ShieldCheck,
  Award,
  Globe,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  Sparkles,
  Edit3,
  Download,
  Satellite,
  Radar,
  Radio,
  Layers,
  X,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onUserUpdate: (user: UserProfile | null) => void;
  savedCount: number;
}

const AVATAR_OPTIONS = [
  { id: "sat-radar", label: "SAR Radar", icon: Radar, color: "bg-sky-600" },
  { id: "sat-earth", label: "Blue Marble", icon: Globe, color: "bg-emerald-600" },
  { id: "sat-orbital", label: "Orbital Constellation", icon: Satellite, color: "bg-amber-600" },
  { id: "sat-quantum", label: "Phased Array", icon: Radio, color: "bg-purple-600" },
  { id: "sat-multispectral", label: "Multispectral", icon: Layers, color: "bg-rose-600" },
];

const ORGANIZATIONS = [
  "ISRO / Space Applications Centre (SAC)",
  "NRSC National Remote Sensing Centre",
  "INCOIS Ocean Information Services",
  "NASA / Jet Propulsion Laboratory (JPL)",
  "ESA European Space Agency",
  "DRDO Defence Research & Development Org",
  "University Earth Observation Lab",
  "Commercial Satellite Analytics Enterprise",
  "Other / Independent Researcher",
];

const MISSIONS = [
  "Maritime & Coastal Estuary Surveillance",
  "Disaster Assessment & Flood Inundation",
  "Urban Growth & Infrastructure Monitoring",
  "Agricultural Health & Crop Yield Prediction",
  "Forestry, Biomass & Carbon Stock Analysis",
  "Multimodal SAR + Optical High-Res Fusion",
];

export function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onUserUpdate,
  savedCount,
}: AuthModalProps) {
  const [tab, setTab] = useState<"signin" | "signup" | "profile">(
    currentUser ? "profile" : "signin"
  );

  // Sync tab if user changes
  useEffect(() => {
    if (currentUser) {
      setTab("profile");
    } else {
      setTab("signin");
    }
  }, [currentUser, isOpen]);

  // Sign In State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Sign Up State
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupOrg, setSignupOrg] = useState(ORGANIZATIONS[0]);
  const [signupCustomOrg, setSignupCustomOrg] = useState("");
  const [signupMission, setSignupMission] = useState(MISSIONS[0]);
  const [signupClearance, setSignupClearance] = useState<
    "Level-1 Public" | "Level-2A BOA Multi-Spectral" | "Level-3 SAR Fusion & Defence"
  >("Level-2A BOA Multi-Spectral");
  const [signupRole, setSignupRole] = useState("Remote Sensing Research Analyst");
  const [signupLocation, setSignupLocation] = useState("New Delhi, India");
  const [signupBio, setSignupBio] = useState("");
  const [signupAvatar, setSignupAvatar] = useState("sat-radar");
  const [signupError, setSignupError] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editOrg, setEditOrg] = useState("");
  const [editMission, setEditMission] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editAvatar, setEditAvatar] = useState("sat-radar");
  const [editClearance, setEditClearance] = useState<
    "Level-1 Public" | "Level-2A BOA Multi-Spectral" | "Level-3 SAR Fusion & Defence"
  >("Level-2A BOA Multi-Spectral");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Initialize edit fields when profile opens
  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditOrg(currentUser.organization);
      setEditMission(currentUser.primaryMission);
      setEditBio(currentUser.bio || "");
      setEditLocation(currentUser.location || "");
      setEditAvatar(currentUser.avatarIcon || "sat-radar");
      setEditClearance(currentUser.clearanceLevel);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  // Handle Login Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Failed to sign in");
        setIsLoggingIn(false);
        return;
      }
      onUserUpdate(data.user);
      localStorage.setItem("satquery_user", JSON.stringify(data.user));
      setTab("profile");
    } catch (err: any) {
      setLoginError(err.message || "Network error during sign in");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Quick Demo Login
  const handleQuickDemoLogin = (email: string) => {
    setLoginEmail(email);
    setLoginPassword("password123");
    setLoginError("");
  };

  // Handle Register Submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword) {
      setSignupError("Please provide your name, email, and password.");
      return;
    }
    setIsSigningUp(true);
    try {
      const orgValue =
        signupOrg === "Other / Independent Researcher" && signupCustomOrg.trim()
          ? signupCustomOrg.trim()
          : signupOrg;

      const payload = {
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        organization: orgValue,
        primaryMission: signupMission,
        clearanceLevel: signupClearance,
        role: signupRole,
        location: signupLocation,
        bio: signupBio,
        avatarIcon: signupAvatar,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setSignupError(data.error || "Failed to create analyst account");
        setIsSigningUp(false);
        return;
      }
      onUserUpdate(data.user);
      localStorage.setItem("satquery_user", JSON.stringify(data.user));
      setTab("profile");
    } catch (err: any) {
      setSignupError(err.message || "Network error during account registration");
    } finally {
      setIsSigningUp(false);
    }
  };

  // Handle Update Profile
  const handleSaveProfile = async () => {
    setIsUpdating(true);
    setUpdateSuccess(false);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          organization: editOrg,
          primaryMission: editMission,
          bio: editBio,
          location: editLocation,
          avatarIcon: editAvatar,
          clearanceLevel: editClearance,
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onUserUpdate(data.user);
        localStorage.setItem("satquery_user", JSON.stringify(data.user));
        setIsEditingProfile(false);
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.warn("Logout ping error:", err);
    }
    localStorage.removeItem("satquery_user");
    onUserUpdate(null);
    setTab("signin");
  };

  // Download Intelligence Dossier
  const handleExportDossier = () => {
    if (!currentUser) return;
    const dossier = {
      title: "SATQUERY AI - Earth Observation Analyst Dossier",
      timestamp: new Date().toISOString(),
      analyst: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        organization: currentUser.organization,
        missionDomain: currentUser.primaryMission,
        clearance: currentUser.clearanceLevel,
        location: currentUser.location,
        bio: currentUser.bio,
      },
      systemPrivileges: {
        multiSpectralResolution: "Sentinel-2 MSI 10m BOA",
        sarInterferometry: "Sentinel-1 C-Band Level-1 GRD",
        peftAdapterAccess: "BigEarthNet-LoRA r=16 a=32",
        databaseClearance: "PostgreSQL Ground Truth Telemetry",
        savedInvestigationsCount: savedCount,
      },
    };

    const blob = new Blob([JSON.stringify(dossier, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SatQuery_Analyst_Dossier_${currentUser.name.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getAvatarComponent = (avatarKey?: string) => {
    const found = AVATAR_OPTIONS.find((a) => a.id === avatarKey) || AVATAR_OPTIONS[0];
    const IconComponent = found.icon;
    return (
      <div
        className={`w-12 h-12 rounded-2xl ${found.color} text-white flex items-center justify-center shadow-md`}
      >
        <IconComponent className="w-6 h-6" />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 text-slate-900">
        {/* Modal Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/75">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-sm">
              <Satellite className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {currentUser
                  ? "Analyst Terminal & Profile"
                  : tab === "signin"
                  ? "Sign In to SatQuery AI"
                  : "Create EO Analyst Account"}
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                {currentUser
                  ? `Clearance: ${currentUser.clearanceLevel}`
                  : "Earth Observation Intelligence Workspace"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher (When not signed in or switching between Profile and Edit) */}
        {!currentUser && (
          <div className="px-6 pt-4 pb-1 border-b border-slate-100 flex gap-2">
            <button
              type="button"
              onClick={() => setTab("signin")}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                tab === "signin"
                  ? "border-sky-600 text-sky-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setTab("signup")}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                tab === "signup"
                  ? "border-sky-600 text-sky-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Sign Up (Register Profile)
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: SIGN IN */}
        {/* ========================================================================= */}
        {!currentUser && tab === "signin" && (
          <div className="p-6 space-y-5">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Analyst Email / Mission ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. harsha.kurella02@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter account security key"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition-all cursor-pointer"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authenticate & Access Workspace</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick 1-Click Demo Profiles */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold font-mono text-slate-400 block mb-2">
                OR 1-CLICK DEMO AUTHENTICATION:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("harsha.kurella02@gmail.com")}
                  className="p-2.5 rounded-xl border border-sky-200 bg-sky-50/60 hover:bg-sky-100 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-600" />
                    <span className="text-xs font-bold text-sky-900">Dr. Harsha Kurella</span>
                  </div>
                  <span className="text-[10px] text-sky-700 block truncate">
                    ISRO / SAC • Maritime & Coastal Lead
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("e.rostova@esa-copernicus.eu")}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">Elena Rostova</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate">
                    ESA Copernicus • Disaster Mapping
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SIGN UP (RICH USER PROFILE CREATION) */}
        {/* ========================================================================= */}
        {!currentUser && tab === "signup" && (
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {signupError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{signupError}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Row 1: Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name / Call-Sign *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g. Dr. Harsha Kurella"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Work / Academic Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="e.g. harsha.kurella02@gmail.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Password & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Choose secure passphrase"
                      className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showSignupPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Analyst Designation / Role
                  </label>
                  <div className="relative">
                    <Award className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={signupRole}
                      onChange={(e) => setSignupRole(e.target.value)}
                      placeholder="e.g. Senior Earth Observation Scientist"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Organization / Agency */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Organization / Space Agency / Institute
                </label>
                <div className="relative mb-1.5">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={signupOrg}
                    onChange={(e) => setSignupOrg(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  >
                    {ORGANIZATIONS.map((org) => (
                      <option key={org} value={org}>
                        {org}
                      </option>
                    ))}
                  </select>
                </div>
                {signupOrg === "Other / Independent Researcher" && (
                  <input
                    type="text"
                    value={signupCustomOrg}
                    onChange={(e) => setSignupCustomOrg(e.target.value)}
                    placeholder="Enter your institution or organization name"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                )}
              </div>

              {/* Row 4: Primary Remote Sensing Mission & Clearance Tier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Mission Focus
                  </label>
                  <div className="relative">
                    <Compass className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={signupMission}
                      onChange={(e) => setSignupMission(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    >
                      {MISSIONS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dataset Clearance Access
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={signupClearance}
                      onChange={(e) =>
                        setSignupClearance(
                          e.target.value as
                            | "Level-1 Public"
                            | "Level-2A BOA Multi-Spectral"
                            | "Level-3 SAR Fusion & Defence"
                        )
                      }
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-mono text-[11px]"
                    >
                      <option value="Level-1 Public">Level-1 Public (Sentinel/Landsat)</option>
                      <option value="Level-2A BOA Multi-Spectral">
                        Level-2A BOA Multi-Spectral (10m)
                      </option>
                      <option value="Level-3 SAR Fusion & Defence">
                        Level-3 SAR Fusion & Defence
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 5: Avatar / Insignia Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Mission Insignia / Avatar
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {AVATAR_OPTIONS.map((opt) => {
                    const IconC = opt.icon;
                    const isSelected = signupAvatar === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSignupAvatar(opt.id)}
                        className={`p-2 rounded-xl flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                          isSelected
                            ? "border-sky-600 bg-sky-50 ring-2 ring-sky-500/30 font-bold"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg ${opt.color} text-white flex items-center justify-center shadow-xs`}
                        >
                          <IconC className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] text-slate-600 truncate w-full text-center">
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 6: Location & Bio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ground Station / Location
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={signupLocation}
                      onChange={(e) => setSignupLocation(e.target.value)}
                      placeholder="e.g. Hyderabad, India"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Research Objective / Brief Bio
                  </label>
                  <input
                    type="text"
                    value={signupBio}
                    onChange={(e) => setSignupBio(e.target.value)}
                    placeholder="e.g. Coastal radar satellite monitoring & deep learning"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSigningUp}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition-all cursor-pointer"
              >
                {isSigningUp ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Registering Analyst Profile...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create Profile & Initialize Clearance</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: AUTHENTICATED PROFILE VIEW & EDIT PROFILE */}
        {/* ========================================================================= */}
        {currentUser && (
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {updateSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Analyst profile credentials updated successfully!</span>
              </div>
            )}

            {!isEditingProfile ? (
              // READ-ONLY PROFILE DOSSIER
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {getAvatarComponent(currentUser.avatarIcon)}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {currentUser.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-700 text-[10px] font-mono font-bold">
                          ACTIVE
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        {currentUser.role}
                      </p>
                      <p className="text-xs text-sky-600 font-semibold flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3" />
                        <span>{currentUser.organization}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Edit Profile</span>
                  </button>
                </div>

                {/* Mission & Clearance Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-slate-50 border border-sky-100 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-sky-600" />
                      <span>Primary Mission:</span>
                    </span>
                    <span className="font-bold text-slate-900 text-right">
                      {currentUser.primaryMission}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Clearance Level:</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-700 text-[11px] bg-emerald-100/60 px-2 py-0.5 rounded">
                      {currentUser.clearanceLevel}
                    </span>
                  </div>

                  {currentUser.location && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <span>Ground Station:</span>
                      </span>
                      <span className="text-slate-700">{currentUser.location}</span>
                    </div>
                  )}

                  {currentUser.bio && (
                    <div className="pt-2 border-t border-sky-100/80 text-[11px] text-slate-600 italic">
                      "{currentUser.bio}"
                    </div>
                  )}
                </div>

                {/* Telemetry & Database Clearance Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      Investigations
                    </span>
                    <span className="text-lg font-bold text-slate-900">
                      {savedCount}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      PEFT Weights
                    </span>
                    <span className="text-xs font-bold text-sky-600 font-mono">
                      LoRA r=16
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      GSD Baseline
                    </span>
                    <span className="text-xs font-bold text-emerald-600 font-mono">
                      10m Multi-Res
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleExportDossier}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Download Dossier</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              // EDIT PROFILE FORM
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">
                    Modify Analyst Profile Information
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Organization
                    </label>
                    <input
                      type="text"
                      value={editOrg}
                      onChange={(e) => setEditOrg(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary Mission
                    </label>
                    <select
                      value={editMission}
                      onChange={(e) => setEditMission(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    >
                      {MISSIONS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Clearance Access
                    </label>
                    <select
                      value={editClearance}
                      onChange={(e) =>
                        setEditClearance(
                          e.target.value as
                            | "Level-1 Public"
                            | "Level-2A BOA Multi-Spectral"
                            | "Level-3 SAR Fusion & Defence"
                        )
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono text-[11px]"
                    >
                      <option value="Level-1 Public">Level-1 Public</option>
                      <option value="Level-2A BOA Multi-Spectral">
                        Level-2A BOA Multi-Spectral
                      </option>
                      <option value="Level-3 SAR Fusion & Defence">
                        Level-3 SAR Fusion & Defence
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Avatar Insignia
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {AVATAR_OPTIONS.map((opt) => {
                      const IconC = opt.icon;
                      const isSelected = editAvatar === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setEditAvatar(opt.id)}
                          className={`p-2 rounded-xl flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                            isSelected
                              ? "border-sky-600 bg-sky-50 ring-2 ring-sky-500/30"
                              : "border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg ${opt.color} text-white flex items-center justify-center`}
                          >
                            <IconC className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[9px] text-slate-600 truncate w-full text-center">
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ground Station / Location
                  </label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="e.g. Hyderabad / ISRO NRSC Shadnagar"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Analyst Bio / Operational Notes
                  </label>
                  <textarea
                    rows={2}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Brief summary of EO focus and satellite data analysis interests..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={isUpdating}
                    className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/20 transition-all cursor-pointer"
                  >
                    {isUpdating ? (
                      <span>Saving Changes...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Save Profile Credentials</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
