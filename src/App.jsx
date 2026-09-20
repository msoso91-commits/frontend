import React, { useState, useRef, useEffect } from "react";
import { API_URL } from "./config";

const COLORS = {
  paper: "#101210",
  paperDark: "#1C1F1B",
  ink: "#F4F1E8",
  gold: "#C9A227",
  teal: "#3FA98C",
  muted: "#9C978A",
  danger: "#E2725B",
};

// ---- Petits utilitaires d'appel API ----
async function apiFetch(path, { token, ...options } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "Une erreur est survenue.");
  return data;
}

function Spinner() {
  return (
    <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={COLORS.ink} strokeWidth="3" opacity="0.3" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke={COLORS.ink} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// Emplacement publicitaire : remplace le contenu par ton bloc <ins class="adsbygoogle">
// une fois ton compte Google AdSense approuvé.
function AdSlot({ label }) {
  return (
    <div
      style={{
        border: `1px dashed ${COLORS.muted}`,
        borderRadius: 8,
        padding: "1rem",
        textAlign: "center",
        fontSize: "0.75rem",
        color: COLORS.muted,
        margin: "1.5rem 0",
      }}
    >
      Emplacement publicitaire — {label}
    </div>
  );
}

// Icônes de la barre d'onglets — traits fins, cohérentes avec le style du logo (pas d'emoji).
function HomeIcon({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 11.5 12 4l8 7.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10.5V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 20v-5h4v5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookIcon({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 6.5c-1.6-1.2-3.6-1.5-6-1.5v13c2.4 0 4.4.3 6 1.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 6.5c1.6-1.2 3.6-1.5 6-1.5v13c-2.4 0-4.4.3-6 1.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 6.5V19.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ProfileIcon({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.4" stroke={color} strokeWidth="1.8" />
      <path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InstallGuide({ onClose }) {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: "1. Ouvre le menu de partage",
      text: "Dans Safari, appuie sur l'icône de partage en bas de l'écran.",
      icon: (
        <svg width="72" height="72" viewBox="0 0 72 72">
          <rect x="10" y="10" width="52" height="52" rx="12" fill="none" stroke={COLORS.gold} strokeWidth="3" />
          <g className="install-guide-bounce">
            <line x1="36" y1="20" x2="36" y2="42" stroke={COLORS.teal} strokeWidth="4" strokeLinecap="round" />
            <path d="M27 29 L36 20 L45 29" fill="none" stroke={COLORS.teal} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <path d="M24 46 v6 a3 3 0 0 0 3 3 h18 a3 3 0 0 0 3-3 v-6" fill="none" stroke={COLORS.teal} strokeWidth="4" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: "2. Cherche « Sur l'écran d'accueil »",
      text: "Fais défiler la liste des options qui apparaît, et appuie sur cette ligne.",
      icon: (
        <svg width="72" height="72" viewBox="0 0 72 72">
          <rect x="10" y="10" width="52" height="52" rx="12" fill="none" stroke={COLORS.gold} strokeWidth="3" />
          <rect x="20" y="22" width="32" height="6" rx="3" fill={COLORS.muted} opacity="0.4" />
          <rect x="20" y="33" width="32" height="6" rx="3" fill={COLORS.teal} className="install-guide-pulse" />
          <rect x="20" y="44" width="20" height="6" rx="3" fill={COLORS.muted} opacity="0.4" />
        </svg>
      ),
    },
    {
      title: "3. Confirme l'ajout",
      text: "Appuie sur « Ajouter » en haut à droite — l'icône Mufradat apparaît sur ton écran d'accueil.",
      icon: (
        <svg width="72" height="72" viewBox="0 0 72 72">
          <rect x="14" y="14" width="44" height="44" rx="11" fill={COLORS.paperDark} stroke={COLORS.gold} strokeWidth="2" />
          <g transform="translate(36,36)">
            <rect x="-8" y="-8" width="16" height="16" fill="none" stroke={COLORS.gold} strokeWidth="1.5" />
            <rect x="-8" y="-8" width="16" height="16" fill="none" stroke={COLORS.gold} strokeWidth="1.5" transform="rotate(45)" />
            <circle cx="0" cy="0" r="3" fill={COLORS.teal} />
          </g>
          <circle cx="36" cy="36" r="26" fill="none" stroke={COLORS.teal} strokeWidth="2" className="install-guide-ring" />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem" }}
    >
      <style>{`
        @keyframes installGuideBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .install-guide-bounce { animation: installGuideBounce 1.2s ease-in-out infinite; transform-origin: center; }
        @keyframes installGuidePulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .install-guide-pulse { animation: installGuidePulse 1.2s ease-in-out infinite; }
        @keyframes installGuideRing { 0% { r: 26; opacity: 0.8; } 100% { r: 34; opacity: 0; } }
        .install-guide-ring { animation: installGuideRing 1.4s ease-out infinite; }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: COLORS.paper, border: `1px solid ${COLORS.gold}`, borderRadius: 12, padding: "1.75rem 1.5rem", maxWidth: 320, width: "100%", textAlign: "center" }}
      >
        <p style={{ color: COLORS.muted, fontSize: "0.75rem", marginBottom: "1rem" }}>Ajouter Mufradat à l'écran d'accueil (Safari, iPhone)</p>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>{steps[step].icon}</div>
        <h3 style={{ fontFamily: "Fraunces, serif", fontSize: "1.05rem", margin: "0 0 0.4rem" }}>{steps[step].title}</h3>
        <p style={{ color: COLORS.muted, fontSize: "0.85rem", lineHeight: 1.5 }}>{steps[step].text}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "0.4rem", margin: "1rem 0" }}>
          {steps.map((_, i) => (
            <span
              key={i}
              onClick={() => setStep(i)}
              style={{ width: 7, height: 7, borderRadius: "50%", background: i === step ? COLORS.teal : COLORS.paperDark, cursor: "pointer" }}
            />
          ))}
        </div>
        <button onClick={onClose} style={{ marginTop: "0.5rem", padding: "0.6rem 1.2rem", borderRadius: 8, background: COLORS.paperDark, color: COLORS.ink, fontSize: "0.85rem" }}>
          Fermer
        </button>
      </div>
    </div>
  );
}

function AuthScreen({ onAuthenticated }) {
  const resetTokenFromUrl = new URLSearchParams(window.location.search).get("reset_token");
  const [mode, setMode] = useState(resetTokenFromUrl ? "reset" : "login"); // "login" | "signup" | "forgot" | "reset"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await apiFetch(`/api/auth/${mode === "login" ? "login" : "signup"}`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      onAuthenticated(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitForgotPassword(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitResetPassword(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiFetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token: resetTokenFromUrl, newPassword }),
      });
      window.history.replaceState({}, "", window.location.pathname);
      setMode("login");
      setMessage("Mot de passe mis à jour, connecte-toi avec ton nouveau mot de passe.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (mode === "reset") {
    return (
      <div style={{ maxWidth: 380, margin: "10vh auto", padding: "0 1rem" }}>
        <img src="/logo.svg" alt="" width={56} height={56} style={{ display: "block", margin: "0 auto" }} />
        <h1 style={{ fontFamily: "Fraunces, serif", textAlign: "center", fontSize: "1.4rem", marginTop: "1rem" }}>
          Nouveau mot de passe
        </h1>
        <form onSubmit={submitResetPassword} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1.5rem" }}>
          <input
            type="password"
            placeholder="Nouveau mot de passe (8 caractères min.)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${COLORS.paperDark}`, background: COLORS.paperDark, color: COLORS.ink }}
          />
          {error && <p style={{ color: COLORS.danger, fontSize: "0.85rem" }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{ padding: "0.75rem", borderRadius: 8, background: COLORS.teal, color: COLORS.paper, fontWeight: 600 }}
          >
            {loading ? "…" : "Valider le nouveau mot de passe"}
          </button>
        </form>
      </div>
    );
  }

  if (mode === "forgot") {
    return (
      <div style={{ maxWidth: 380, margin: "10vh auto", padding: "0 1rem" }}>
        <img src="/logo.svg" alt="" width={56} height={56} style={{ display: "block", margin: "0 auto" }} />
        <h1 style={{ fontFamily: "Fraunces, serif", textAlign: "center", fontSize: "1.4rem", marginTop: "1rem" }}>
          Mot de passe oublié
        </h1>
        <p style={{ color: COLORS.muted, fontSize: "0.85rem", textAlign: "center", marginTop: "0.5rem" }}>
          Indique ton email, on t'envoie un lien pour choisir un nouveau mot de passe.
        </p>
        <form onSubmit={submitForgotPassword} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1.5rem" }}>
          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${COLORS.paperDark}`, background: COLORS.paperDark, color: COLORS.ink }}
          />
          {message && <p style={{ color: COLORS.teal, fontSize: "0.85rem" }}>{message}</p>}
          {error && <p style={{ color: COLORS.danger, fontSize: "0.85rem" }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{ padding: "0.75rem", borderRadius: 8, background: COLORS.teal, color: COLORS.paper, fontWeight: 600 }}
          >
            {loading ? "…" : "Envoyer le lien"}
          </button>
        </form>
        <button
          onClick={() => {
            setMode("login");
            setError(null);
            setMessage(null);
          }}
          style={{ background: "none", color: COLORS.muted, fontSize: "0.85rem", marginTop: "1rem", width: "100%", textAlign: "center" }}
        >
          ← Retour à la connexion
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 380, margin: "10vh auto", padding: "0 1rem" }}>
      <img src="/logo.svg" alt="" width={56} height={56} style={{ display: "block", margin: "0 auto" }} />
      <div style={{ fontFamily: "Amiri, serif", fontSize: "2.2rem", color: COLORS.teal, textAlign: "center", marginTop: "0.5rem" }} dir="rtl">
        مُفْرَدَات
      </div>
      <h1 style={{ fontFamily: "Fraunces, serif", textAlign: "center", fontSize: "1.4rem", marginTop: "0.5rem" }}>
        {mode === "login" ? "Connexion" : "Créer un compte"}
      </h1>
      {mode === "signup" && (
        <p style={{ color: COLORS.muted, fontSize: "0.85rem", textAlign: "center", marginTop: "0.5rem" }}>
          Prends une page de livre en photo, obtiens en quelques secondes un tableau de ses verbes et mots avec
          leurs formes grammaticales et leur traduction.
        </p>
      )}
      {message && <p style={{ color: COLORS.teal, fontSize: "0.85rem", textAlign: "center", marginTop: "0.75rem" }}>{message}</p>}
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1.5rem" }}>
        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${COLORS.paperDark}`, background: COLORS.paperDark, color: COLORS.ink }}
        />
        <input
          type="password"
          placeholder="Mot de passe (8 caractères min.)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${COLORS.paperDark}`, background: COLORS.paperDark, color: COLORS.ink }}
        />
        {mode === "login" && (
          <button
            type="button"
            onClick={() => {
              setMode("forgot");
              setError(null);
            }}
            style={{ background: "none", color: COLORS.gold, fontSize: "0.8rem", textAlign: "right", alignSelf: "flex-end" }}
          >
            Mot de passe oublié ?
          </button>
        )}
        {error && <p style={{ color: COLORS.danger, fontSize: "0.85rem" }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "0.75rem", borderRadius: 8, background: COLORS.teal, color: COLORS.paper, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
        >
          {loading && <Spinner />}
          {mode === "login" ? "Se connecter" : "Créer mon compte"}
        </button>
      </form>
      <button
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        style={{ background: "none", color: COLORS.muted, fontSize: "0.85rem", marginTop: "1rem", width: "100%", textAlign: "center" }}
      >
        {mode === "login" ? "Pas encore de compte ? Inscris-toi" : "Déjà un compte ? Connecte-toi"}
      </button>
      <button
        onClick={() => setShowInstallGuide(true)}
        style={{ background: "none", color: COLORS.gold, fontSize: "0.8rem", marginTop: "0.75rem", width: "100%", textAlign: "center" }}
      >
        📲 Comment installer l'app sur mon téléphone ?
      </button>
      <AdSlot label="bannière connexion" />
      <footer style={{ marginTop: "2.5rem", textAlign: "center", fontSize: "0.75rem", color: COLORS.muted, display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
        <a href="/about.html" style={{ color: COLORS.muted }}>À propos</a>
        <a href="/confidentialite.html" style={{ color: COLORS.muted }}>Confidentialité</a>
        <a href="/mentions-legales.html" style={{ color: COLORS.muted }}>Mentions légales</a>
        <a href="/contact.html" style={{ color: COLORS.muted }}>Contact</a>
      </footer>
      {showInstallGuide && <InstallGuide onClose={() => setShowInstallGuide(false)} />}
    </div>
  );
}

// Tableau des verbes / noms — mot arabe + traduction resserrée sous lui,
// lignes bien séparées visuellement (bandes alternées + bordure plus marquée).
function WordTable({ rows, columns, onReport }) {
  const [reportedRows, setReportedRows] = useState({});

  if (!rows || rows.length === 0) return null;

  function handleReport(row, i) {
    setReportedRows((prev) => ({ ...prev, [i]: true }));
    onReport?.(row);
  }

  return (
    <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gold}`, background: "rgba(255,255,255,0.03)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480, fontSize: "0.85rem" }}>
        <thead>
          <tr style={{ background: COLORS.paperDark }}>
            {columns.map((c) => (
              <th key={c.key} style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: COLORS.muted, whiteSpace: "nowrap", borderBottom: `1px solid ${COLORS.gold}` }}>
                {c.label}
              </th>
            ))}
            {onReport && <th style={{ borderBottom: `1px solid ${COLORS.gold}` }}></th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 1 ? "rgba(255,255,255,0.025)" : "transparent", borderTop: `1px solid ${COLORS.paperDark}` }}>
              {columns.map((c, ci) => (
                <td key={c.key} style={{ padding: "0.6rem 0.75rem", verticalAlign: "middle" }} dir="rtl">
                  {ci === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                      <span style={{ fontFamily: "Amiri, serif", fontSize: "1.15rem", lineHeight: 1.2 }}>{row[c.key]}</span>
                      {row.traduction && (
                        <span dir="ltr" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.68rem", color: COLORS.muted, lineHeight: 1.2 }}>
                          {row.traduction}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span style={{ fontFamily: "Amiri, serif", lineHeight: 1.2 }}>{row[c.key] || "—"}</span>
                  )}
                </td>
              ))}
              {onReport && (
                <td style={{ padding: "0.6rem 0.5rem", textAlign: "center" }}>
                  <button
                    onClick={() => handleReport(row, i)}
                    disabled={reportedRows[i]}
                    title="Signaler une erreur sur cette ligne"
                    style={{ background: "none", color: reportedRows[i] ? COLORS.teal : COLORS.muted, fontSize: "0.7rem" }}
                  >
                    {reportedRows[i] ? "✓" : "⚑"}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MainApp({ token, user, onLogout, onPullRefresh }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [freshResult, setFreshResult] = useState(null);
  const [viewingPage, setViewingPage] = useState(null);
  const [pages, setPages] = useState([]);
  const [view, setView] = useState("home");
  const [subscriptionStatus, setSubscriptionStatus] = useState("free");
  const [upgrading, setUpgrading] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [pullDistance, setPullDistance] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const touchStartY = useRef(null);
  const fileRef = useRef(null);

  const containerRef = useRef(null);

  function handleTouchStart(e) {
    if (window.scrollY === 0) touchStartY.current = e.touches[0].clientY;
  }

  function handleTouchEnd() {
    if (pullDistance > 60) {
      refreshData();
      onPullRefresh?.();
    }
    setPullDistance(0);
    touchStartY.current = null;
  }

  // Écouteur natif pour suivre le geste de tirage (le rebond naturel de Safari reste actif).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function onMove(e) {
      if (touchStartY.current == null) return;
      const delta = e.touches[0].clientY - touchStartY.current;
      if (delta > 0 && window.scrollY === 0) {
        setPullDistance(Math.min(delta, 90));
      }
    }
    el.addEventListener("touchmove", onMove, { passive: true });
    return () => el.removeEventListener("touchmove", onMove);
  }, []);

  function refreshData() {
    apiFetch("/api/pages", { token })
      .then((data) => setPages(data.pages))
      .catch(() => {});

    apiFetch("/api/billing/status", { token })
      .then((data) => setSubscriptionStatus(data.status))
      .catch(() => {});
  }

  useEffect(() => {
    refreshData();

    const params = new URLSearchParams(window.location.search);
    if (params.get("subscription") === "success") {
      setTimeout(refreshData, 2000);
      window.history.replaceState({}, "", window.location.pathname);
    }

    // Rafraîchit dès qu'on revient sur l'app (changement d'onglet, retour au premier plan),
    // sans intervalle automatique en continu.
    function handleVisibility() {
      if (document.visibilityState === "visible") refreshData();
    }
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", refreshData);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", refreshData);
    };
  }, [token]);

  async function startUpgrade() {
    setUpgrading(true);
    try {
      const data = await apiFetch("/api/billing/create-checkout-session", { token, method: "POST" });
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setUpgrading(false);
    }
  }

  async function openBillingPortal() {
    setUpgrading(true);
    try {
      const data = await apiFetch("/api/billing/create-portal-session", { token, method: "POST" });
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setUpgrading(false);
    }
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setFreshResult(null);
    const reader = new FileReader();
    reader.onload = () => setImage({ data: reader.result, mediaType: file.type });
    reader.readAsDataURL(file);
  }

  function reset() {
    setImage(null);
    setFreshResult(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function analyze() {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const base64 = image.data.split(",")[1];
      const data = await apiFetch("/api/pages/analyze", {
        token,
        method: "POST",
        body: JSON.stringify({ imageBase64: base64, mediaType: image.mediaType }),
      });
      setFreshResult(data.page);
      setPages((prev) => [data.page, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deletePage(id) {
    setPages((prev) => prev.filter((p) => p.id !== id));
    try {
      await apiFetch(`/api/pages/${id}`, { token, method: "DELETE" });
    } catch {}
  }

  function startRenaming(p) {
    setRenamingId(p.id);
    setRenameValue(p.titre || "");
  }

  async function saveRename(id) {
    const titre = renameValue.trim();
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, titre } : p)));
    setRenamingId(null);
    try {
      await apiFetch(`/api/pages/${id}`, { token, method: "PATCH", body: JSON.stringify({ titre }) });
    } catch (err) {
      setError(err.message);
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    setPasswordMessage(null);
    setPasswordLoading(true);
    try {
      await apiFetch("/api/auth/password", {
        token,
        method: "PATCH",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setPasswordMessage({ type: "success", text: "Mot de passe mis à jour." });
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setShowPasswordForm(false), 1500);
    } catch (err) {
      setPasswordMessage({ type: "error", text: err.message });
    } finally {
      setPasswordLoading(false);
    }
  }

  function reportError(wordType, row) {
    apiFetch("/api/pages/report-error", {
      token,
      method: "POST",
      body: JSON.stringify({ wordType, row }),
    }).catch(() => {});
  }

  async function deleteAccount() {
    setDeletingAccount(true);
    try {
      await apiFetch("/api/auth/account", { token, method: "DELETE" });
      onLogout();
    } catch (err) {
      setError(err.message);
      setDeletingAccount(false);
      setShowDeleteConfirm(false);
    }
  }

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ maxWidth: 720, margin: "0 auto", padding: "1.5rem 1rem 7.5rem", position: "relative", minHeight: "100vh" }}
    >
      <header style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: `1px solid ${COLORS.gold}`, paddingBottom: "1rem", marginBottom: "1.5rem" }}>
        <img src="/logo.svg" alt="" width={32} height={32} />
        <div>
          <div style={{ fontFamily: "Amiri, serif", fontSize: "1.3rem", color: COLORS.teal, lineHeight: 1 }} dir="rtl">
            مُفْرَدَات
          </div>
          <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "1rem", margin: "0.2rem 0 0", color: COLORS.muted }}>Mufradat</h1>
        </div>
      </header>

      <AdSlot label="bannière haute" />

      {view === "home" && (
        <>
          <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "1.9rem", fontWeight: 700, color: COLORS.ink, marginBottom: "1.25rem" }}>
            Analyseur
          </h1>
          <div style={{ borderRadius: 8, padding: "1rem", marginBottom: "1.5rem", background: "rgba(255,255,255,0.04)", border: `1px solid ${COLORS.gold}` }}>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: "none" }} />
            {!image ? (
              <button
                onClick={() => fileRef.current?.click()}
                style={{ width: "100%", padding: "2rem 1rem", borderRadius: 8, border: `2px dashed ${COLORS.gold}`, background: "none", color: COLORS.muted, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}
              >
                <span style={{ fontSize: "1.6rem" }}>📷</span>
                <span style={{ color: COLORS.ink, fontWeight: 600 }}>Prendre ou choisir une photo</span>
                <span style={{ fontSize: "0.75rem" }}>Cadre bien le texte pour un meilleur résultat</span>
              </button>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
                <img src={image.data} alt="Page à analyser" style={{ width: 128, height: 80, objectFit: "cover", borderRadius: 6, border: `1px solid ${COLORS.gold}` }} />
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <button
                    onClick={analyze}
                    disabled={loading}
                    style={{ padding: "0.6rem 1rem", borderRadius: 8, background: COLORS.teal, color: COLORS.paper, fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}
                  >
                    {loading && <Spinner />}
                    {loading ? "Analyse en cours…" : "Analyser la page"}
                  </button>
                  <button onClick={() => fileRef.current?.click()} style={{ padding: "0.6rem 1rem", borderRadius: 8, background: COLORS.paperDark, color: COLORS.ink }}>
                    Changer
                  </button>
                  <button onClick={reset} style={{ padding: "0.6rem 1rem", borderRadius: 8, background: "none", color: COLORS.danger }}>
                    Effacer
                  </button>
                </div>
              </div>
            )}
            {error && <p style={{ color: COLORS.danger, fontSize: "0.85rem", marginTop: "0.75rem" }}>{error}</p>}
          </div>

          {freshResult && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {freshResult.verbes?.length > 0 && (
                <section>
                  <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "1.1rem", marginBottom: "0.6rem" }}>Verbes</h2>
                  <WordTable
                    rows={freshResult.verbes}
                    onReport={(row) => reportError("verbe", row)}
                    columns={[
                      { key: "mot", label: "Mot" },
                      { key: "passe", label: "Passé" },
                      { key: "present", label: "Présent" },
                      { key: "imperatif", label: "Impératif" },
                      { key: "masdar", label: "Masdar" },
                    ]}
                  />
                </section>
              )}
              {freshResult.noms?.length > 0 && (
                <section>
                  <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "1.1rem", marginBottom: "0.6rem" }}>Noms</h2>
                  <WordTable
                    rows={freshResult.noms}
                    onReport={(row) => reportError("nom", row)}
                    columns={[
                      { key: "mot", label: "Mot" },
                      { key: "synonyme", label: "Synonyme" },
                      { key: "contraire", label: "Contraire" },
                      { key: "pluriel", label: "Pluriel" },
                    ]}
                  />
                </section>
              )}
            </div>
          )}

          <AdSlot label="bannière basse" />

          <p style={{ marginTop: "2rem", fontSize: "0.75rem", color: COLORS.muted, textAlign: "center" }}>
            Les formes marquées « — » ou « ? » signalent une incertitude plutôt qu'une réponse inventée.
          </p>
        </>
      )}

      {view === "history" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "1.9rem", fontWeight: 700, color: COLORS.ink, marginBottom: "0.25rem" }}>
            Pages
          </h1>
          {pages.length === 0 && <p style={{ color: COLORS.muted, fontSize: "0.9rem" }}>Aucune page enregistrée pour l'instant.</p>}
          {pages.map((p) => (
            <div key={p.id} style={{ borderRadius: 8, padding: "0.75rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.04)", border: `1px solid ${COLORS.paperDark}` }}>
              {renamingId === p.id ? (
                <div style={{ display: "flex", flex: 1, gap: "0.5rem", alignItems: "center" }}>
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveRename(p.id)}
                    placeholder="Nom de la page"
                    maxLength={100}
                    style={{ flex: 1, padding: "0.4rem 0.6rem", borderRadius: 6, border: `1px solid ${COLORS.gold}`, background: COLORS.paperDark, color: COLORS.ink, fontSize: "0.85rem" }}
                  />
                  <button onClick={() => saveRename(p.id)} style={{ background: "none", color: COLORS.teal, fontSize: "0.8rem", fontWeight: 600 }}>
                    OK
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setViewingPage(p);
                    setView("page");
                  }}
                  style={{ background: "none", color: COLORS.ink, textAlign: "left", flex: 1 }}
                >
                  <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                    {p.titre || `${p.verbes.length} verbe${p.verbes.length !== 1 ? "s" : ""} · ${p.noms.length} nom${p.noms.length !== 1 ? "s" : ""}`}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: COLORS.muted }}>{new Date(p.created_at).toLocaleDateString("fr-FR")}</div>
                </button>
              )}
              {renamingId !== p.id && (
                <button onClick={() => startRenaming(p)} style={{ background: "none", color: COLORS.gold, fontSize: "0.8rem" }} title="Renommer">
                  ✏️
                </button>
              )}
              <button onClick={() => deletePage(p.id)} style={{ background: "none", color: COLORS.danger, fontSize: "0.75rem" }}>
                Supprimer
              </button>
            </div>
          ))}
          {pages.length > 0 && <AdSlot label="bannière basse (historique)" />}
        </div>
      )}

      {view === "page" && (
        <div>
          <button
            onClick={() => setView("history")}
            style={{ background: "none", color: COLORS.gold, fontSize: "0.85rem", marginBottom: "1.25rem" }}
          >
            ← Retour à mes pages
          </button>
          {viewingPage?.titre && (
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "1.3rem", marginBottom: "1rem" }}>{viewingPage.titre}</h2>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {viewingPage?.verbes?.length > 0 && (
              <section>
                <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "1.1rem", marginBottom: "0.6rem" }}>Verbes</h2>
                <WordTable
                  rows={viewingPage.verbes}
                  onReport={(row) => reportError("verbe", row)}
                  columns={[
                    { key: "mot", label: "Mot" },
                    { key: "passe", label: "Passé" },
                    { key: "present", label: "Présent" },
                    { key: "imperatif", label: "Impératif" },
                    { key: "masdar", label: "Masdar" },
                  ]}
                />
              </section>
            )}
            {viewingPage?.noms?.length > 0 && (
              <section>
                <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "1.1rem", marginBottom: "0.6rem" }}>Noms</h2>
                <WordTable
                  rows={viewingPage.noms}
                  onReport={(row) => reportError("nom", row)}
                  columns={[
                    { key: "mot", label: "Mot" },
                    { key: "synonyme", label: "Synonyme" },
                    { key: "contraire", label: "Contraire" },
                    { key: "pluriel", label: "Pluriel" },
                  ]}
                />
              </section>
            )}
          </div>
          <AdSlot label="bannière basse (page)" />
          <p style={{ marginTop: "2rem", fontSize: "0.75rem", color: COLORS.muted, textAlign: "center" }}>
            Les formes marquées « — » ou « ? » signalent une incertitude plutôt qu'une réponse inventée.
          </p>
        </div>
      )}

      {view === "profile" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "1.9rem", fontWeight: 700, color: COLORS.ink, marginBottom: "0.25rem" }}>
            Profil
          </h1>
          <div style={{ borderRadius: 8, padding: "1.25rem", background: "rgba(255,255,255,0.04)", border: `1px solid ${COLORS.paperDark}` }}>
            <p style={{ fontSize: "0.75rem", color: COLORS.muted, marginBottom: "0.25rem" }}>Connecté en tant que</p>
            <p style={{ fontSize: "0.95rem", fontWeight: 600 }}>{user.email}</p>
          </div>

          <div style={{ borderRadius: 8, padding: "1.25rem", background: "rgba(255,255,255,0.04)", border: `1px solid ${COLORS.gold}` }}>
            {subscriptionStatus === "active" ? (
              <>
                <p style={{ fontSize: "0.85rem", marginBottom: "0.75rem" }}>✨ Abonnement illimité actif</p>
                <button
                  onClick={openBillingPortal}
                  disabled={upgrading}
                  style={{ padding: "0.6rem 1rem", borderRadius: 8, background: COLORS.teal, color: COLORS.paper, fontWeight: 600, fontSize: "0.85rem" }}
                >
                  {upgrading ? "Redirection…" : "Gérer / résilier l'abonnement"}
                </button>
              </>
            ) : (
              <>
                <p style={{ fontSize: "0.85rem", marginBottom: "0.75rem" }}>Usage gratuit limité par jour. Passe à l'illimité pour ne plus être bloqué.</p>
                <button
                  onClick={startUpgrade}
                  disabled={upgrading}
                  style={{ padding: "0.6rem 1rem", borderRadius: 8, background: COLORS.gold, color: COLORS.paper, fontWeight: 600, fontSize: "0.85rem" }}
                >
                  {upgrading ? "Redirection…" : "✨ Passer à l'illimité — 4,99€/mois"}
                </button>
              </>
            )}
          </div>

          <div style={{ borderRadius: 8, padding: "1.25rem", background: "rgba(255,255,255,0.04)", border: `1px solid ${COLORS.paperDark}` }}>
            {!showPasswordForm ? (
              <button onClick={() => setShowPasswordForm(true)} style={{ background: "none", color: COLORS.ink, fontSize: "0.85rem", fontWeight: 600 }}>
                🔒 Changer le mot de passe
              </button>
            ) : (
              <form onSubmit={changePassword} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <input
                  type="password"
                  placeholder="Mot de passe actuel"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  style={{ padding: "0.6rem", borderRadius: 8, border: `1px solid ${COLORS.gold}`, background: COLORS.paperDark, color: COLORS.ink, fontSize: "0.85rem" }}
                />
                <input
                  type="password"
                  placeholder="Nouveau mot de passe (8 caractères min.)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  style={{ padding: "0.6rem", borderRadius: 8, border: `1px solid ${COLORS.gold}`, background: COLORS.paperDark, color: COLORS.ink, fontSize: "0.85rem" }}
                />
                {passwordMessage && (
                  <p style={{ fontSize: "0.8rem", color: passwordMessage.type === "success" ? COLORS.teal : COLORS.danger }}>
                    {passwordMessage.text}
                  </p>
                )}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    style={{ padding: "0.5rem 1rem", borderRadius: 8, background: COLORS.teal, color: COLORS.paper, fontWeight: 600, fontSize: "0.8rem" }}
                  >
                    {passwordLoading ? "…" : "Valider"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordMessage(null);
                      setCurrentPassword("");
                      setNewPassword("");
                    }}
                    style={{ padding: "0.5rem 1rem", borderRadius: 8, background: "none", color: COLORS.muted, fontSize: "0.8rem" }}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>

          <button onClick={() => setShowLogoutConfirm(true)} style={{ padding: "0.75rem", borderRadius: 8, background: "none", border: `1px solid ${COLORS.danger}`, color: COLORS.danger, fontSize: "0.85rem" }}>
            Déconnexion
          </button>

          <button onClick={() => setShowDeleteConfirm(true)} style={{ padding: "0.6rem", background: "none", color: COLORS.muted, fontSize: "0.75rem", textDecoration: "underline" }}>
            Supprimer définitivement mon compte
          </button>

          <AdSlot label="bannière profil" />

          <footer style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.75rem", color: COLORS.muted, display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/about.html" style={{ color: COLORS.muted }}>À propos</a>
            <a href="/confidentialite.html" style={{ color: COLORS.muted }}>Confidentialité</a>
            <a href="/mentions-legales.html" style={{ color: COLORS.muted }}>Mentions légales</a>
            <a href="/contact.html" style={{ color: COLORS.muted }}>Contact</a>
          </footer>
        </div>
      )}

      {/* Barre d'onglets flottante, en bulle rectangulaire surélevée */}
      <nav
        style={{
          position: "fixed",
          bottom: "calc(1.1rem + env(safe-area-inset-bottom))",
          left: "50%",
          transform: "translateX(-50%)",
          background: COLORS.paperDark,
          border: `1px solid ${COLORS.gold}`,
          borderRadius: 18,
          boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
          display: "flex",
          gap: "1.25rem",
          padding: "0.6rem 1.5rem",
          zIndex: 30,
        }}
      >
        {[
          { key: "home", Icon: HomeIcon, label: "Accueil" },
          { key: "history", Icon: BookIcon, label: "Pages" },
          { key: "profile", Icon: ProfileIcon, label: "Profil" },
        ].map((tab) => {
          const active = view === tab.key || (tab.key === "history" && view === "page");
          return (
            <button
              key={tab.key}
              onClick={() => setView(tab.key)}
              style={{
                background: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                color: active ? COLORS.teal : COLORS.muted,
                fontSize: "0.7rem",
                fontWeight: active ? 600 : 400,
                padding: "0.25rem 0.75rem",
              }}
            >
              <tab.Icon color={active ? COLORS.teal : COLORS.muted} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {showLogoutConfirm && (
        <div
          onClick={() => setShowLogoutConfirm(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: "1rem" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: COLORS.paper, border: `1px solid ${COLORS.gold}`, borderRadius: 12, padding: "1.5rem", maxWidth: 300, width: "100%", textAlign: "center" }}
          >
            <p style={{ fontSize: "0.95rem", marginBottom: "1.25rem" }}>Êtes-vous sûr de vouloir vous déconnecter ?</p>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{ padding: "0.6rem 1.1rem", borderRadius: 8, background: COLORS.paperDark, color: COLORS.ink, fontSize: "0.85rem" }}
              >
                Annuler
              </button>
              <button
                onClick={onLogout}
                style={{ padding: "0.6rem 1.1rem", borderRadius: 8, background: COLORS.danger, color: COLORS.ink, fontWeight: 600, fontSize: "0.85rem" }}
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div
          onClick={() => !deletingAccount && setShowDeleteConfirm(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: "1rem" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: COLORS.paper, border: `1px solid ${COLORS.danger}`, borderRadius: 12, padding: "1.5rem", maxWidth: 320, width: "100%", textAlign: "center" }}
          >
            <p style={{ fontSize: "0.95rem", marginBottom: "0.5rem", fontWeight: 600 }}>Supprimer définitivement ton compte ?</p>
            <p style={{ fontSize: "0.8rem", color: COLORS.muted, marginBottom: "1.25rem" }}>
              Toutes tes pages analysées seront perdues et ton abonnement, s'il y en a un, sera résilié. Cette action est irréversible.
            </p>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deletingAccount}
                style={{ padding: "0.6rem 1.1rem", borderRadius: 8, background: COLORS.paperDark, color: COLORS.ink, fontSize: "0.85rem" }}
              >
                Annuler
              </button>
              <button
                onClick={deleteAccount}
                disabled={deletingAccount}
                style={{ padding: "0.6rem 1.1rem", borderRadius: 8, background: COLORS.danger, color: COLORS.ink, fontWeight: 600, fontSize: "0.85rem" }}
              >
                {deletingAccount ? "Suppression…" : "Supprimer définitivement"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SplashScreen({ leaving, overlay }) {
  return (
    <div
      style={{
        position: overlay ? "fixed" : "static",
        inset: overlay ? 0 : undefined,
        zIndex: overlay ? 100 : undefined,
        minHeight: "100vh",
        background: COLORS.paper,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: leaving ? 0 : 1,
        transition: "opacity 0.35s ease",
      }}
    >
      <style>{`
        @keyframes splashIntro {
          0% { transform: scale(0.4); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes splashDraw {
          from { stroke-dashoffset: 210; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes splashGlow {
          0%, 100% { filter: drop-shadow(0 0 0px ${COLORS.gold}); }
          50% { filter: drop-shadow(0 0 6px ${COLORS.gold}); }
        }
        .splash-logo { animation: splashIntro 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both, splashGlow 1.6s ease-in-out 0.7s infinite; }
        .splash-ring { animation: splashDraw 1s ease-out both; transform: rotate(-90deg); transform-origin: 36px 36px; }
        .splash-word { animation: splashIntro 0.6s ease 0.35s both; }
      `}</style>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ position: "relative", width: 72, height: 72 }}>
          <svg className="splash-ring" width="72" height="72" viewBox="0 0 72 72" style={{ position: "absolute", top: 0, left: 0 }}>
            <circle cx="36" cy="36" r="33" fill="none" stroke={COLORS.paperDark} strokeWidth="2" />
            <circle cx="36" cy="36" r="33" fill="none" stroke={COLORS.teal} strokeWidth="2.5" strokeDasharray="210" strokeLinecap="round" />
          </svg>
          <img src="/logo.svg" alt="" width={56} height={56} className="splash-logo" style={{ position: "absolute", top: 8, left: 8 }} />
        </div>
        <div className="splash-word" style={{ fontFamily: "Amiri, serif", fontSize: "1.3rem", color: COLORS.teal }} dir="rtl">
          مُفْرَدَات
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [splashLeaving, setSplashLeaving] = useState(false);
  const [showResumeSplash, setShowResumeSplash] = useState(false);
  const hasMountedRef = useRef(false);
  const resumeTimeoutRef = useRef(null);

  useEffect(() => {
    const minDelay = new Promise((resolve) => setTimeout(resolve, 1200));
    const savedToken = localStorage.getItem("token");

    const sessionCheck = !savedToken
      ? Promise.resolve()
      : apiFetch("/api/auth/me", { token: savedToken })
          .then((data) => {
            setToken(savedToken);
            setUser(data.user);
          })
          .catch(() => {
            localStorage.removeItem("token");
          });

    Promise.all([minDelay, sessionCheck]).then(() => {
      setSplashLeaving(true);
      setTimeout(() => {
        setCheckingSession(false);
        hasMountedRef.current = true;
      }, 350);
    });
  }, []);

  function playResumeSplash() {
    if (!hasMountedRef.current) return;
    setShowResumeSplash(true);
    clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => setShowResumeSplash(false), 1100);
  }

  // Rejoue brièvement l'animation quand l'utilisateur revient sur l'app
  // (changement d'onglet, retour au premier plan) sans avoir fermé l'app.
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === "visible") playResumeSplash();
    }
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", playResumeSplash);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", playResumeSplash);
      clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  function handleAuthenticated(t, u) {
    localStorage.setItem("token", t);
    setToken(t);
    setUser(u);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  if (checkingSession) {
    return <SplashScreen leaving={splashLeaving} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.paper }}>
      {token && user ? (
        <MainApp token={token} user={user} onLogout={handleLogout} onPullRefresh={playResumeSplash} />
      ) : (
        <AuthScreen onAuthenticated={handleAuthenticated} />
      )}
      {showResumeSplash && <SplashScreen leaving={false} overlay />}
    </div>
  );
}
