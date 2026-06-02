"use client";
import { useState, useEffect, useCallback } from "react";

type Client = { id: number; name: string; phone: string; cpf?: string; allergies?: string };
type Professional = { id: number; name: string; specialty: string };
type Appointment = { id: number; service: string; date: string; status: string; price: number; client: Client; professional: Professional; notes?: string };

const C = { bg:"#fdf4ff", sidebar:"#581c87", card:"#fff", border:"#e9d5ff", accent:"#9333ea", muted:"#9ca3af", text:"#1e1b4b", warn:"#d97706", green:"#16a34a" };
const STATUS_C: Record<string,string> = { scheduled:"#7c3aed", "in-progress":"#d97706", done:"#16a34a", cancelled:"#6b7280" };
const SERVICES = ["Limpeza de pele","Peeling","Botox","Preenchimento","Massagem facial","Drenagem","Laser","Micropigmentação","Fio de prata","Design de sobrancelha"];

export default function App() {
  const [tab, setTab] = useState<"dash"|"clients"|"appts"|"profs">("dash");
  const [clients, setClients] = useState<Client[]>([]);
  const [profs, setProfs] = useState<Professional[]>([]);
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [cf, setCf] = useState({ name:"", phone:"", cpf:"", email:"", allergies:"", medications:"" });
  const [pf, setPf] = useState({ name:"", specialty:"", registration:"" });
  const [apf, setApf] = useState({ clientId:"", professionalId:"", service:"Limpeza de pele", date:"", price:"", notes:"" });
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const [c,p,a] = await Promise.all([fetch("/api/clients").then(r=>r.json()),fetch("/api/professionals").then(r=>r.json()),fetch("/api/appointments").then(r=>r.json())]);
    setClients(c); setProfs(p); setAppts(a);
  },[]);
  useEffect(()=>{ load(); },[load]);
  const toast = (m:string) => { setMsg(m); setTimeout(()=>setMsg(""),3000); };

  async function addClient(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/clients",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:cf.name,phone:cf.phone,cpf:cf.cpf||undefined,allergies:cf.allergies||undefined,medications:cf.medications||undefined})});
    setCf({name:"",phone:"",cpf:"",email:"",allergies:"",medications:""}); toast("Cliente cadastrada!"); load();
  }
  async function addProf(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/professionals",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:pf.name,specialty:pf.specialty,registration:pf.registration||undefined})});
    setPf({name:"",specialty:"",registration:""}); toast("Profissional cadastrada!"); load();
  }
  async function addAppt(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/appointments",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({clientId:Number(apf.clientId),professionalId:Number(apf.professionalId),service:apf.service,date:new Date(apf.date).toISOString(),price:Number(apf.price),notes:apf.notes||undefined})});
    setApf({clientId:"",professionalId:"",service:"Limpeza de pele",date:"",price:"",notes:""}); toast("Agendamento criado!"); load();
  }
  async function updStatus(id:number,status:string) {
    await fetch(`/api/appointments/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status})});
    load();
  }

  const pending = appts.filter(a=>a.status==="scheduled");
  const revenue = appts.filter(a=>a.status==="done").reduce((s,a)=>s+a.price,0);

  const s = {
    shell:{display:"flex",minHeight:"100vh",fontFamily:"'Segoe UI',sans-serif",background:C.bg},
    sb:{width:230,background:C.sidebar,color:"#fff",display:"flex",flexDirection:"column" as const},
    logo:{padding:"1.5rem",borderBottom:"1px solid #6b21a8"},
    nbtn:(a:boolean)=>({display:"block",width:"100%",textAlign:"left" as const,padding:"0.75rem 1.5rem",background:a?"#6b21a8":"transparent",color:a?"#e9d5ff":"#c4b5fd",border:"none",cursor:"pointer",fontSize:"0.875rem",borderLeft:a?"3px solid #c084fc":"3px solid transparent"}),
    main:{flex:1,padding:"2rem",color:C.text},
    grid:(n:number)=>({display:"grid",gridTemplateColumns:`repeat(${n},1fr)`,gap:"1rem",marginBottom:"1.5rem"}),
    card:{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"1.25rem"},
    cardN:{fontSize:"2rem",fontWeight:700,color:C.accent},
    sec:{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"1.25rem",marginBottom:"1rem"},
    sh:{fontSize:"0.9rem",fontWeight:600,color:C.text,marginBottom:"0.75rem",paddingBottom:"0.5rem",borderBottom:`1px solid ${C.border}`},
    form:{display:"flex",flexDirection:"column" as const,gap:"0.6rem"},
    lbl:{fontSize:"0.77rem",fontWeight:600,color:C.muted,display:"block",marginBottom:"0.15rem"},
    inp:{width:"100%",padding:"0.5rem 0.7rem",background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,color:C.text,fontSize:"0.875rem",boxSizing:"border-box" as const},
    btn:{padding:"0.6rem 1.25rem",background:C.accent,color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer"},
    row:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.5rem 0",borderBottom:`1px solid #faf5ff`},
    table:{width:"100%",borderCollapse:"collapse" as const,fontSize:"0.83rem"},
    th:{textAlign:"left" as const,padding:"0.5rem",color:C.muted,fontSize:"0.72rem",textTransform:"uppercase" as const,borderBottom:`1px solid ${C.border}`},
    td:{padding:"0.6rem 0.5rem",borderBottom:`1px solid #faf5ff`,color:C.text},
    badge:(col:string)=>({background:col+"22",color:col,fontSize:"0.7rem",fontWeight:600,padding:"2px 8px",borderRadius:20}),
    sbtn:(col:string)=>({padding:"3px 9px",background:col+"22",color:col,border:`1px solid ${col}44`,borderRadius:5,fontSize:"0.72rem",cursor:"pointer",fontWeight:600}),
    msg:{color:C.accent,fontWeight:600,fontSize:"0.83rem"},
    gr2:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"},
  };

  return (
    <div style={s.shell}>
      <aside style={s.sb}>
        <div style={s.logo}>
          <div style={{fontSize:"1.1rem",fontWeight:700,color:"#e9d5ff"}}>✨ Aesthetix</div>
          <div style={{fontSize:"0.72rem",color:"#c4b5fd",marginTop:"0.2rem"}}>Clínica de Estética</div>
        </div>
        <nav style={{flex:1}}>
          {([["dash","📊 Dashboard"],["clients","👩 Clientes"],["appts","📅 Agendamentos"],["profs","💆 Profissionais"]] as const).map(([t,l])=>(
            <button key={t} style={s.nbtn(tab===t)} onClick={()=>setTab(t)}>{l}</button>
          ))}
        </nav>
        <div style={{padding:"1rem 1.5rem",borderTop:"1px solid #6b21a8",fontSize:"0.72rem",color:"#c4b5fd"}}>
          {clients.length} clientes · {profs.length} profissionais
        </div>
      </aside>

      <main style={s.main}>
        {tab==="dash" && <>
          <h1 style={{fontSize:"1.4rem",fontWeight:700,marginBottom:"0.25rem",color:C.text}}>Dashboard</h1>
          <p style={{color:C.muted,fontSize:"0.83rem",marginBottom:"1.5rem"}}>Visão geral da clínica</p>
          <div style={s.grid(4)}>
            {[[String(clients.length),"Clientes"],[String(profs.length),"Profissionais"],[String(pending.length),"Pendentes"],["R$ "+revenue.toFixed(0),"Receita"]].map(([n,l])=>(
              <div key={l} style={s.card}><div style={s.cardN}>{n}</div><div style={{color:C.muted,fontSize:"0.75rem",textTransform:"uppercase" as const,letterSpacing:"0.05em"}}>{l}</div></div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
            <div style={s.sec}>
              <div style={s.sh}>Próximos agendamentos</div>
              {pending.slice(0,5).map(a=>(
                <div key={a.id} style={s.row}>
                  <div><div style={{fontWeight:600,fontSize:"0.875rem"}}>{a.client.name}</div><div style={{color:C.muted,fontSize:"0.78rem"}}>{a.service} · {new Date(a.date).toLocaleDateString("pt-BR")}</div></div>
                  <span style={s.badge(STATUS_C[a.status]??"#888")}>{a.status}</span>
                </div>
              ))}
              {pending.length===0 && <p style={{color:C.muted,fontSize:"0.83rem"}}>Nenhum agendamento pendente.</p>}
            </div>
            <div style={s.sec}>
              <div style={s.sh}>Equipe</div>
              {profs.map(p=>(
                <div key={p.id} style={s.row}>
                  <div><div style={{fontWeight:600,fontSize:"0.875rem"}}>{p.name}</div><div style={{color:C.muted,fontSize:"0.78rem"}}>{p.specialty}</div></div>
                  <span style={{fontSize:"0.78rem",color:C.muted}}>{appts.filter(a=>a.professional?.id===p.id).length} sessões</span>
                </div>
              ))}
              {profs.length===0 && <p style={{color:C.muted,fontSize:"0.83rem"}}>Nenhum profissional cadastrado.</p>}
            </div>
          </div>
        </>}

        {tab==="clients" && <>
          <h1 style={{fontSize:"1.4rem",fontWeight:700,marginBottom:"1.5rem"}}>Clientes</h1>
          <div style={{display:"grid",gridTemplateColumns:"380px 1fr",gap:"1.5rem"}}>
            <div style={s.sec}>
              <div style={s.sh}>Nova cliente</div>
              <form style={s.form} onSubmit={addClient}>
                <div><label style={s.lbl}>Nome completo</label><input style={s.inp} value={cf.name} onChange={e=>setCf(f=>({...f,name:e.target.value}))} required/></div>
                <div style={s.gr2}>
                  <div><label style={s.lbl}>Telefone</label><input style={s.inp} value={cf.phone} onChange={e=>setCf(f=>({...f,phone:e.target.value}))} required/></div>
                  <div><label style={s.lbl}>CPF</label><input style={s.inp} value={cf.cpf} onChange={e=>setCf(f=>({...f,cpf:e.target.value}))} placeholder="000.000.000-00"/></div>
                </div>
                <div><label style={s.lbl}>Alergias</label><input style={s.inp} value={cf.allergies} onChange={e=>setCf(f=>({...f,allergies:e.target.value}))} placeholder="ex: penicilina, látex"/></div>
                <div><label style={s.lbl}>Medicamentos</label><input style={s.inp} value={cf.medications} onChange={e=>setCf(f=>({...f,medications:e.target.value}))} placeholder="medicamentos em uso"/></div>
                <button style={s.btn}>Cadastrar</button>
                {msg && <span style={s.msg}>✓ {msg}</span>}
              </form>
            </div>
            <div style={s.sec}>
              <div style={s.sh}>Clientes ({clients.length})</div>
              <table style={s.table}><thead><tr><th style={s.th}>Nome</th><th style={s.th}>Telefone</th><th style={s.th}>CPF</th><th style={s.th}>Alergias</th></tr></thead>
              <tbody>{clients.map(c=>(<tr key={c.id}><td style={s.td}><strong>{c.name}</strong></td><td style={s.td}>{c.phone}</td><td style={s.td}>{c.cpf??"-"}</td><td style={s.td}>{c.allergies??"-"}</td></tr>))}</tbody></table>
              {clients.length===0 && <p style={{color:C.muted,fontSize:"0.83rem",marginTop:"1rem"}}>Nenhuma cliente cadastrada.</p>}
            </div>
          </div>
        </>}

        {tab==="appts" && <>
          <h1 style={{fontSize:"1.4rem",fontWeight:700,marginBottom:"1.5rem"}}>Agendamentos</h1>
          <div style={{display:"grid",gridTemplateColumns:"380px 1fr",gap:"1.5rem"}}>
            <div style={s.sec}>
              <div style={s.sh}>Novo agendamento</div>
              <form style={s.form} onSubmit={addAppt}>
                <div><label style={s.lbl}>Cliente</label><select style={s.inp} value={apf.clientId} onChange={e=>setApf(f=>({...f,clientId:e.target.value}))} required><option value="">Selecione...</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                <div><label style={s.lbl}>Profissional</label><select style={s.inp} value={apf.professionalId} onChange={e=>setApf(f=>({...f,professionalId:e.target.value}))} required><option value="">Selecione...</option>{profs.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                <div><label style={s.lbl}>Procedimento</label><select style={s.inp} value={apf.service} onChange={e=>setApf(f=>({...f,service:e.target.value}))}>{SERVICES.map(sv=><option key={sv}>{sv}</option>)}</select></div>
                <div style={s.gr2}>
                  <div><label style={s.lbl}>Data/hora</label><input style={s.inp} type="datetime-local" value={apf.date} onChange={e=>setApf(f=>({...f,date:e.target.value}))} required/></div>
                  <div><label style={s.lbl}>Valor R$</label><input style={s.inp} type="number" step="0.01" value={apf.price} onChange={e=>setApf(f=>({...f,price:e.target.value}))} required/></div>
                </div>
                <div><label style={s.lbl}>Observações / Anamnese</label><input style={s.inp} value={apf.notes} onChange={e=>setApf(f=>({...f,notes:e.target.value}))}/></div>
                <button style={s.btn}>Agendar</button>
                {msg && <span style={s.msg}>✓ {msg}</span>}
              </form>
            </div>
            <div style={s.sec}>
              <div style={s.sh}>Agendamentos ({appts.length})</div>
              <table style={s.table}><thead><tr><th style={s.th}>Cliente</th><th style={s.th}>Profissional</th><th style={s.th}>Procedimento</th><th style={s.th}>Data</th><th style={s.th}>Valor</th><th style={s.th}>Status</th><th style={s.th}></th></tr></thead>
              <tbody>{appts.map(a=>(
                <tr key={a.id}>
                  <td style={s.td}>{a.client.name}</td><td style={s.td}>{a.professional.name}</td><td style={s.td}>{a.service}</td>
                  <td style={s.td}>{new Date(a.date).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}</td>
                  <td style={s.td}>R$ {a.price.toFixed(2)}</td>
                  <td style={s.td}><span style={s.badge(STATUS_C[a.status]??"#888")}>{a.status}</span></td>
                  <td style={s.td}>
                    {a.status==="scheduled" && <button style={s.sbtn(C.warn)} onClick={()=>updStatus(a.id,"in-progress")}>Iniciar</button>}
                    {a.status==="in-progress" && <button style={s.sbtn(C.green)} onClick={()=>updStatus(a.id,"done")}>Concluir</button>}
                  </td>
                </tr>
              ))}</tbody></table>
            </div>
          </div>
        </>}

        {tab==="profs" && <>
          <h1 style={{fontSize:"1.4rem",fontWeight:700,marginBottom:"1.5rem"}}>Profissionais</h1>
          <div style={{display:"grid",gridTemplateColumns:"360px 1fr",gap:"1.5rem"}}>
            <div style={s.sec}>
              <div style={s.sh}>Nova profissional</div>
              <form style={s.form} onSubmit={addProf}>
                <div><label style={s.lbl}>Nome</label><input style={s.inp} value={pf.name} onChange={e=>setPf(f=>({...f,name:e.target.value}))} required/></div>
                <div><label style={s.lbl}>Especialidade</label><input style={s.inp} value={pf.specialty} placeholder="ex: Esteticista, Enfermeira, Biomédica" onChange={e=>setPf(f=>({...f,specialty:e.target.value}))} required/></div>
                <div><label style={s.lbl}>Registro profissional</label><input style={s.inp} value={pf.registration} onChange={e=>setPf(f=>({...f,registration:e.target.value}))}/></div>
                <button style={s.btn}>Cadastrar</button>
                {msg && <span style={s.msg}>✓ {msg}</span>}
              </form>
            </div>
            <div style={s.sec}>
              <div style={s.sh}>Profissionais ({profs.length})</div>
              <table style={s.table}><thead><tr><th style={s.th}>Nome</th><th style={s.th}>Especialidade</th><th style={s.th}>Registro</th><th style={s.th}>Sessões</th></tr></thead>
              <tbody>{profs.map(p=>(
                <tr key={p.id}><td style={s.td}><strong>{p.name}</strong></td><td style={s.td}>{p.specialty}</td><td style={s.td}>{(p as any).registration??"-"}</td><td style={s.td}>{appts.filter(a=>a.professional?.id===p.id).length}</td></tr>
              ))}</tbody></table>
              {profs.length===0 && <p style={{color:C.muted,fontSize:"0.83rem",marginTop:"1rem"}}>Nenhuma profissional cadastrada.</p>}
            </div>
          </div>
        </>}
      </main>
    </div>
  );
}