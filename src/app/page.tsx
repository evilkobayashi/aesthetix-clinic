export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", background: "#0d1117", minHeight: "100vh", color: "#c9d1d9" }}>
      <h1 style={{ color: "#39d353" }}>Aesthetix Clinic</h1>
      <p>Sistema de gestão para clínicas de estética avançada.</p>
      <nav style={{ marginTop: "2rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <a href="/clients" style={{ color: "#58a6ff" }}>Clientes</a>
        <a href="/appointments" style={{ color: "#58a6ff" }}>Agendamentos</a>
        <a href="/professionals" style={{ color: "#58a6ff" }}>Profissionais</a>
        <a href="/stock" style={{ color: "#58a6ff" }}>Estoque</a>
      </nav>
    </main>
  );
}
