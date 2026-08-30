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
// une fois ton compte Google AdSense approuvé. Voir index.html pour le script à ajouter.
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

function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={{ maxWidth: 380, margin: "10vh auto", padding: "0 1rem" }}>
      <div style={{ fontFamily: "Amiri, serif", fontSize: "2.2rem", color: COLORS.teal, textAlign: "center" }} dir="rtl">
        صَفْحَة
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
      <footer style={{ marginTop: "2.5rem", textAlign: "center", fontSize: "0.75rem", color: COLORS.muted, display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
        <a href="/about.html" style={{ color: COLORS.muted }}>À propos</a>
        <a href="/confidentialite.html" style={{ color: COLORS.muted }}>Confidentialité</a>
        <a href="/mentions-legales.html" style={{ color: COLORS.muted }}>Mentions légales</a>
        <a href="/contact.html" style={{ color: COLORS.muted }}>Contact</a>
      </footer>
    </div>
  );
}

function WordTable({ rows, columns }) {
  if (!rows || rows.length === 0) return null;
  return (
    <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gold}`, background: "rgba(255,255,255,0.03)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480, fontSize: "0.85rem" }}>
        <thead>
          <tr style={{ background: COLORS.paperDark }}>
            {columns.map((c) => (
              <th key={c.key} style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: COLORS.muted, whiteSpace: "nowrap" }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderTop: `1px solid ${COLORS.paperDark}` }}>
              {columns.map((c, ci) => (
                <td key={c.key} dir="rtl" style={{ padding: "0.5rem 0.75rem", verticalAlign: "top" }}>
                  {ci === 0 ? (
                    <>
                      <div style={{ fontFamily: "Amiri, serif", fontSize: "1.1rem" }}>{row[c.key]}</div>
                      {row.traduction && (
                        <div dir="ltr" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.68rem", color: COLORS.muted, marginTop: 2 }}>
                          {row.traduction}
                        </div>
                      )}
                    </>
                  ) : (
                    <span style={{ fontFamily: "Amiri, serif" }}>{row[c.key] || "—"}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MainApp({ token, user, onLogout }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [pages, setPages] = useState([]);
  const [view, setView] = useState("analyze");
  const [subscriptionStatus, setSubscriptionStatus] = useState("free");
  const [upgrading, setUpgrading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    apiFetch("/api/pages", { token })
      .then((data) => setPages(data.pages))
      .catch(() => {});
    apiFetch("/api/billing/status", { token })
      .then((data) => setSubscriptionStatus(data.status))
      .catch(() => {});

    const params = new URLSearchParams(window.location.search);
    if (params.get("subscription") === "success") {
      // Laisse un court instant au webhook Stripe pour mettre à jour la base avant de rafraîchir.
      setTimeout(() => {
        apiFetch("/api/billing/status", { token })
          .then((data) => setSubscriptionStatus(data.status))
          .catch(() => {});
      }, 2000);
      window.history.replaceState({}, "", window.location.pathname);
    }
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

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setResult(null);
    const reader = new FileReader();
    reader.onload = () => setImage({ data: reader.result, mediaType: file.type });
    reader.readAsDataURL(file);
  }

  function reset() {
    setImage(null);
    setResult(null);
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
      setResult(data.page);
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

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "1.5rem 1rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", borderBottom: `1px solid ${COLORS.gold}`, paddingBottom: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ fontFamily: "Amiri, serif", fontSize: "clamp(1.6rem, 6vw, 2.2rem)", color: COLORS.teal, lineHeight: 1 }} dir="rtl">
            صَفْحَة
          </div>
          <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(1.2rem, 4vw, 1.6rem)", margin: "0.4rem 0 0" }}>Analyseur de page arabe</h1>
          <p style={{ color: COLORS.muted, fontSize: "0.85rem", margin: "0.2rem 0 0" }}>{user.email}</p>
          {subscriptionStatus === "active" ? (
            <span style={{ display: "inline-block", marginTop: "0.4rem", fontSize: "0.7rem", padding: "0.2rem 0.5rem", borderRadius: 999, background: COLORS.teal, color: COLORS.paper, fontWeight: 600 }}>
              ✨ Abonné — analyses illimitées
            </span>
          ) : (
            <button
              onClick={startUpgrade}
              disabled={upgrading}
              style={{ display: "inline-block", marginTop: "0.4rem", fontSize: "0.7rem", padding: "0.3rem 0.6rem", borderRadius: 999, background: COLORS.gold, color: COLORS.paper, fontWeight: 600 }}
            >
              {upgrading ? "Redirection…" : "✨ Passer à l'illimité — 4,99€/mois"}
            </button>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-end" }}>
          <button
            onClick={() => setView(view === "history" ? "analyze" : "history")}
            style={{ padding: "0.5rem 0.75rem", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: `1px solid ${COLORS.gold}`, color: COLORS.ink, fontSize: "0.8rem" }}
          >
            📚 {view === "history" ? "Retour" : `Mes pages (${pages.length})`}
          </button>
          <button onClick={onLogout} style={{ background: "none", color: COLORS.muted, fontSize: "0.75rem" }}>
            Déconnexion
          </button>
        </div>
      </header>

      <AdSlot label="bannière haute" />

      {view === "history" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {pages.length === 0 && <p style={{ color: COLORS.muted, fontSize: "0.9rem" }}>Aucune page enregistrée pour l'instant.</p>}
          {pages.map((p) => (
            <div key={p.id} style={{ borderRadius: 8, padding: "0.75rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${COLORS.paperDark}` }}>
              <button
                onClick={() => {
                  setResult(p);
                  setView("analyze");
                }}
                style={{ background: "none", color: COLORS.ink, textAlign: "left", flex: 1 }}
              >
                <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  {p.verbes.length} verbe{p.verbes.length !== 1 ? "s" : ""} · {p.noms.length} nom{p.noms.length !== 1 ? "s" : ""}
                </div>
                <div style={{ fontSize: "0.75rem", color: COLORS.muted }}>{new Date(p.created_at).toLocaleDateString("fr-FR")}</div>
              </button>
              <button onClick={() => deletePage(p.id)} style={{ background: "none", color: COLORS.danger, fontSize: "0.75rem" }}>
                Supprimer
              </button>
            </div>
          ))}
        </div>
      ) : (
        <>
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

          {result && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {result.verbes?.length > 0 && (
                <section>
                  <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "1.1rem", marginBottom: "0.6rem" }}>Verbes</h2>
                  <WordTable
                    rows={result.verbes}
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
              {result.noms?.length > 0 && (
                <section>
                  <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "1.1rem", marginBottom: "0.6rem" }}>Noms</h2>
                  <WordTable
                    rows={result.noms}
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
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  function handleAuthenticated(t, u) {
    setToken(t);
    setUser(u);
    // Pour une vraie mise en production (hors artifact Claude), tu peux
    // persister la session avec : localStorage.setItem("token", t)
    // et la relire au chargement, pour éviter de se reconnecter à chaque visite.
  }

  function handleLogout() {
    setToken(null);
    setUser(null);
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.paper }}>
      {token && user ? (
        <MainApp token={token} user={user} onLogout={handleLogout} />
      ) : (
        <AuthScreen onAuthenticated={handleAuthenticated} />
      )}
    </div>
  );
}
