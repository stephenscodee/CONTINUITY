import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProcess, createStep, updateStep, deleteStep, createFailure, getFailures } from '../api'

export default function ProcessView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [proc, setProc] = useState(null)
  const [stepTitle, setStepTitle] = useState("")
  const [stepDescription, setStepDescription] = useState("")
  const [stepResponsible, setStepResponsible] = useState("")
  const [stepMinutes, setStepMinutes] = useState("")
  const [stepTools, setStepTools] = useState("")
  const [showStepForm, setShowStepForm] = useState(false)
  const [failures, setFailures] = useState({})
  const [editingStep, setEditingStep] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      navigate("/login")
      return
    }
    load()
  }, [id, navigate])

  const load = async () => {
    try {
      const p = await getProcess(id)
      setProc(p)
      
      // Load failures for each step
      const failuresMap = {}
      for (const step of p.steps || []) {
        try {
          const stepFailures = await getFailures(step.id)
          failuresMap[step.id] = stepFailures
        } catch (err) {
          failuresMap[step.id] = []
        }
      }
      setFailures(failuresMap)
    } catch (err) {
      console.error("Error loading process:", err)
    }
  }

  const addStep = async (e) => {
    e.preventDefault()
    if (!stepTitle) return
    try {
      const maxPosition = proc.steps.length > 0 
        ? Math.max(...proc.steps.map(s => s.position || 0)) + 1 
        : 1
      
      await createStep(id, {
        title: stepTitle,
        description: stepDescription || null,
        responsible_user_id: stepResponsible || null,
        estimated_minutes: stepMinutes ? parseInt(stepMinutes) : null,
        tools: stepTools || null,
        position: maxPosition
      })
      setStepTitle("")
      setStepDescription("")
      setStepResponsible("")
      setStepMinutes("")
      setStepTools("")
      setShowStepForm(false)
      load()
    } catch (err) {
      console.error("Error creating step:", err)
    }
  }

  const editStep = (step) => {
    setEditingStep(step)
    setStepTitle(step.title)
    setStepDescription(step.description || "")
    setStepResponsible(step.responsible_user_id || "")
    setStepMinutes(step.estimated_minutes?.toString() || "")
    setStepTools(step.tools || "")
    setShowStepForm(true)
  }

  const updateStepHandler = async (e) => {
    e.preventDefault()
    if (!editingStep || !stepTitle) return
    try {
      await updateStep(editingStep.id, {
        title: stepTitle,
        description: stepDescription || null,
        responsible_user_id: stepResponsible || null,
        estimated_minutes: stepMinutes ? parseInt(stepMinutes) : null,
        tools: stepTools || null,
        position: editingStep.position
      })
      setEditingStep(null)
      setStepTitle("")
      setStepDescription("")
      setStepResponsible("")
      setStepMinutes("")
      setStepTools("")
      setShowStepForm(false)
      load()
    } catch (err) {
      console.error("Error updating step:", err)
    }
  }

  const removeStep = async (stepId) => {
    if (!window.confirm("¿Eliminar este paso?")) return
    try {
      await deleteStep(stepId)
      load()
    } catch (err) {
      console.error("Error deleting step:", err)
    }
  }

  const addFailure = async (stepId) => {
    const reason = prompt("Motivo del fallo:")
    if (!reason) return
    try {
      await createFailure(stepId, {
        usually_fails: true,
        reason: reason,
        impact_type: "tiempo"
      })
      load()
    } catch (err) {
      console.error("Error creating failure:", err)
    }
  }

  if (!proc) return <div>Loading...</div>

  const sortedSteps = [...(proc.steps || [])].sort((a, b) => (a.position || 0) - (b.position || 0))

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => navigate("/processes")} style={{ marginBottom: 12 }}>← Volver</button>
        <h2>{proc.name}</h2>
        {proc.objective && <p style={{ color: "#666", marginBottom: 12 }}>{proc.objective}</p>}
        <div style={{ fontSize: "14px", color: "#666" }}>
          {proc.frequency && <span style={{ marginRight: 16 }}>📅 {proc.frequency}</span>}
          {proc.validated ? (
            <span style={{ color: "#28a745" }}>✓ Validado</span>
          ) : (
            <span style={{ color: "#ffc107" }}>⚠ No validado</span>
          )}
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3>Pasos del Proceso</h3>
          <button onClick={() => {
            setEditingStep(null)
            setStepTitle("")
            setStepDescription("")
            setStepResponsible("")
            setStepMinutes("")
            setStepTools("")
            setShowStepForm(!showStepForm)
          }}>
            {showStepForm ? "Cancelar" : "+ Agregar Paso"}
          </button>
        </div>

        {showStepForm && (
          <form onSubmit={editingStep ? updateStepHandler : addStep} style={{ marginBottom: 20, padding: 16, background: "#f8f9fa", borderRadius: 4 }}>
            <h4>{editingStep ? "Editar Paso" : "Nuevo Paso"}</h4>
            <input
              placeholder="Título del paso *"
              value={stepTitle}
              onChange={(e) => setStepTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Descripción (opcional)"
              value={stepDescription}
              onChange={(e) => setStepDescription(e.target.value)}
              rows="3"
            />
            <input
              placeholder="Responsable (ID de usuario o rol)"
              value={stepResponsible}
              onChange={(e) => setStepResponsible(e.target.value)}
            />
            <input
              type="number"
              placeholder="Tiempo estimado (minutos)"
              value={stepMinutes}
              onChange={(e) => setStepMinutes(e.target.value)}
            />
            <input
              placeholder="Herramientas usadas"
              value={stepTools}
              onChange={(e) => setStepTools(e.target.value)}
            />
            <button type="submit">{editingStep ? "Actualizar" : "Crear"} Paso</button>
          </form>
        )}

        {sortedSteps.length === 0 ? (
          <p>No hay pasos definidos. Agrega el primer paso para comenzar.</p>
        ) : (
          sortedSteps.map((s) => (
            <div key={s.id} className="list-item" style={{ padding: "16px", background: "#fafafa", borderRadius: 4, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontWeight: "bold", marginRight: 12, color: "#0366d6" }}>
                      {s.position || 0}.
                    </span>
                    <strong style={{ fontSize: "16px" }}>{s.title}</strong>
                  </div>
                  {s.description && (
                    <p style={{ margin: "8px 0", color: "#666", fontSize: "14px" }}>{s.description}</p>
                  )}
                  <div style={{ fontSize: "12px", color: "#666", marginTop: 8 }}>
                    {s.responsible_user_id && (
                      <span style={{ marginRight: 12 }}>👤 {s.responsible_user_id}</span>
                    )}
                    {s.responsible_role && (
                      <span style={{ marginRight: 12 }}>🎭 {s.responsible_role}</span>
                    )}
                    {s.estimated_minutes && (
                      <span style={{ marginRight: 12 }}>⏱ {s.estimated_minutes} min</span>
                    )}
                    {s.tools && (
                      <span style={{ marginRight: 12 }}>🛠 {s.tools}</span>
                    )}
                  </div>
                  {failures[s.id] && failures[s.id].length > 0 && (
                    <div style={{ marginTop: 12, padding: 8, background: "#fff3cd", borderRadius: 4 }}>
                      <strong style={{ fontSize: "12px", color: "#856404" }}>⚠️ Fallos reportados:</strong>
                      {failures[s.id].map((f) => (
                        <div key={f.id} style={{ fontSize: "12px", marginTop: 4, color: "#856404" }}>
                          • {f.reason} {f.occurrences_count > 1 && `(${f.occurrences_count} veces)`}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ marginLeft: 16 }}>
                  <button 
                    onClick={() => addFailure(s.id)}
                    style={{ fontSize: "12px", padding: "4px 8px", marginRight: 4, background: "#dc3545" }}
                  >
                    ⚠️ Fallo
                  </button>
                  <button 
                    onClick={() => editStep(s)}
                    style={{ fontSize: "12px", padding: "4px 8px", marginRight: 4, background: "#6c757d" }}
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => removeStep(s.id)}
                    style={{ fontSize: "12px", padding: "4px 8px", background: "#dc3545" }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

