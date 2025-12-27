import React, { useEffect, useState } from 'react'
import { processService } from '../services/api'
import { Plus, Search, BookOpen, Clock, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

const ProcessList = () => {
  const [processes, setProcesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const response = await processService.getAll()
        setProcesses(response.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProcesses()
  }, [])

  const filteredProcesses = processes.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Listado de Procesos</h1>
        <Link 
          to="/processes/new" 
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-sm shadow-blue-200"
        >
          <Plus className="w-5 h-5" />
          Nuevo Proceso
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text"
          placeholder="Buscar proceso..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Cargando procesos...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProcesses.map(p => (
            <Link 
              key={p.id} 
              to={`/processes/${p.id}`}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 text-primary rounded-lg">
                  <BookOpen className="w-6 h-6" />
                </div>
                {p.steps.length === 0 && (
                  <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    Sin pasos
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{p.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{p.objective || 'Sin objetivo definido'}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-400 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {p.frequency || 'N/A'}
                </div>
                <div className="flex items-center gap-1">
                  <Plus className="w-3 h-3 rotate-45" /> {p.steps.length} pasos
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && filteredProcesses.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400">No se encontraron procesos.</p>
          <Link to="/processes/new" className="text-primary mt-2 inline-block">Crea el primero ahora</Link>
        </div>
      )}
    </div>
  )
}

export default ProcessList
