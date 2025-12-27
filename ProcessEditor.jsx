import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { processService } from '../services/api'
import { Save, Plus, Trash2, AlertTriangle, Clock, User, Tool, ChevronDown, ChevronUp } from 'lucide-react'

const ProcessEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id

  const [process, setProcess] = useState({
    name: '',
    objective: '',
    frequency: 'daily',
    steps: []
  })
  
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isNew) {
      const fetchProcess = async () => {
        try {
          const response = await processService.getById(id)
          // Map API response to component state format
          const processData = response.data
          setProcess({
            name: processData.name || '',
            objective: processData.objective || '',
            frequency: processData.frequency || 'daily',
            steps: (processData.steps || []).map(step => ({
              position: step.position || 0,
              title: step.title || '',
              description: step.description || '',
              responsible_role: step.responsible_role || '',
              estimated_minutes: step.estimated_minutes || null,
              tools: step.tools || '',
              failures: step.failures || []
            }))
          })
        } catch (err) {
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
      fetchProcess()
    }
  }, [id, isNew])

  const handleProcessChange = (e) => {
    setProcess({ ...process, [e.target.name]: e.target.value })
  }

  const addStep = () => {
    const newStep = {
      position: process.steps.length + 1,
      title: '',
      description: '',
      responsible_role: '',
      estimated_minutes: 0,
      tools: '',
      failures: []
    }
    setProcess({ ...process, steps: [...process.steps, newStep] })
  }

  const handleStepChange = (index, field, value) => {
    const newSteps = [...process.steps]
    newSteps[index][field] = value
    setProcess({ ...process, steps: newSteps })
  }

  const addFailure = (stepIndex) => {
    const newSteps = [...process.steps]
    const failureTemplate = {
      description: '',
      reason: '',
      impact: 'time'
    }
    newSteps[stepIndex].failures = [...(newSteps[stepIndex].failures || []), failureTemplate]
    setProcess({ ...process, steps: newSteps })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (isNew) {
        // Simple logic for MVP: create process then steps would be separate in real API
        // For now, let's just mock the save or implement the sequential logic
        const res = await processService.create({
          name: process.name,
          objective: process.objective,
          frequency: process.frequency
        })
        
        // Save steps sequentially - map fields to API format
        for (const step of process.steps) {
          await processService.addStep(res.data.id, {
            title: step.title,
            description: step.description || null,
            responsible_role: step.responsible_role || null,
            estimated_minutes: step.estimated_minutes || null,
            tools: step.tools || null,
            position: step.position || process.steps.indexOf(step) + 1
          })
        }
      } else {
        // Update logic (simplified for MVP)
        console.log('Update not fully implemented in mock API yet')
      }
      navigate('/processes')
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Cargando editor...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">{isNew ? 'Nuevo Proceso' : 'Editar Proceso'}</h1>
          <p className="text-gray-500 text-sm">Define los pasos y detecta puntos críticos.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 disabled:opacity-50 transition-all font-bold"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Guardando...' : 'Guardar Proceso'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nombre del Proceso</label>
            <input 
              name="name"
              value={process.name}
              onChange={handleProcessChange}
              placeholder="Ej: Onboarding de Clientes"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Frecuencia</label>
            <select 
              name="frequency"
              value={process.frequency}
              onChange={handleProcessChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="daily">Diario</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
              <option value="on-demand">Puntual</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Objetivo</label>
          <textarea 
            name="objective"
            value={process.objective}
            onChange={handleProcessChange}
            placeholder="¿Qué se consigue al finalizar este proceso?"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-24 resize-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Pasos del Proceso</h2>
          <button 
            onClick={addStep}
            className="text-primary flex items-center gap-1 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Añadir paso
          </button>
        </div>

        <div className="space-y-4">
          {process.steps.map((step, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden group">
              <div className="p-4 bg-gray-50 flex items-center justify-between border-b bg-opacity-30">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </span>
                  <input 
                    value={step.title}
                    onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                    placeholder="Título del paso..."
                    className="bg-transparent font-bold outline-none border-b border-transparent focus:border-primary px-1"
                  />
                </div>
                <button className="text-gray-300 hover:text-danger">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-gray-400 mt-1" />
                    <div className="flex-1 space-y-1">
                      <label className="text-xs uppercase font-bold text-gray-400">Responsable (Rol o Persona)</label>
                      <input 
                        value={step.responsible_role || ''}
                        onChange={(e) => handleStepChange(idx, 'responsible_role', e.target.value)}
                        placeholder="Ej: Account Manager"
                        className="w-full text-sm outline-none border-b border-gray-100 focus:border-primary py-1"
                      />
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-gray-400 mt-1" />
                    <div className="flex-1 space-y-1">
                      <label className="text-xs uppercase font-bold text-gray-400">Tiempo Estimado (minutos)</label>
                      <input 
                        type="number"
                        value={step.estimated_minutes || ''}
                        onChange={(e) => handleStepChange(idx, 'estimated_minutes', e.target.value ? parseInt(e.target.value) : null)}
                        className="w-full text-sm outline-none border-b border-gray-100 focus:border-primary py-1"
                      />
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Tool className="w-4 h-4 text-gray-400 mt-1" />
                    <div className="flex-1 space-y-1">
                      <label className="text-xs uppercase font-bold text-gray-400">Herramientas</label>
                      <input 
                        value={step.tools || ''}
                        onChange={(e) => handleStepChange(idx, 'tools', e.target.value)}
                        placeholder="Slack, CRM, Excel..."
                        className="w-full text-sm outline-none border-b border-gray-100 focus:border-primary py-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 bg-gray-50 bg-opacity-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs uppercase font-bold text-red-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Puntos de Fallo / Fricción
                    </h4>
                    <button 
                      onClick={() => addFailure(idx)}
                      className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded uppercase font-bold hover:bg-red-200 transition-colors"
                    >
                      Reportar Fallo
                    </button>
                  </div>
                  
                  {step.failures?.map((fail, fIdx) => (
                    <div key={fIdx} className="bg-white p-3 rounded border border-red-100 text-sm space-y-2">
                      <input 
                        placeholder="Aquí suele fallar porque..."
                        className="w-full bg-transparent outline-none italic"
                        value={fail.description}
                        onChange={(e) => {
                          const newSteps = [...process.steps]
                          newSteps[idx].failures[fIdx].description = e.target.value
                          setProcess({ ...process, steps: newSteps })
                        }}
                      />
                      <select 
                        className="text-[10px] uppercase font-bold text-gray-400 bg-transparent border-none outline-none"
                        value={fail.impact}
                        onChange={(e) => {
                          const newSteps = [...process.steps]
                          newSteps[idx].failures[fIdx].impact = e.target.value
                          setProcess({ ...process, steps: newSteps })
                        }}
                      >
                        <option value="time">Impacto: Tiempo</option>
                        <option value="money">Impacto: Dinero</option>
                        <option value="customer">Impacto: Cliente</option>
                      </select>
                    </div>
                  ))}
                  
                  {(!step.failures || step.failures.length === 0) && (
                    <p className="text-[10px] text-gray-400 italic text-center py-4">Sin fallos conocidos reportados.</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {process.steps.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
              <p className="text-gray-400 mb-4">Aún no hay pasos definidos para este proceso.</p>
              <button 
                onClick={addStep}
                className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all font-medium"
              >
                Comenzar a documentar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProcessEditor
