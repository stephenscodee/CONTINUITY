import React, { useEffect, useState } from 'react'
import { metricsService } from '../services/api'
import { AlertCircle, ArrowRight, BookOpen, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await metricsService.getDashboard()
        setMetrics(response.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMetrics()
  }, [])

  if (loading) return <div className="text-center py-20 text-gray-400">Cargando métricas...</div>

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard de Continuidad</h1>
        <p className="text-gray-500 mt-2">Estado real de la dependencia operativa de tu empresa.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl font-bold">{metrics?.total_processes || 0}</div>
          <div className="text-sm text-gray-500">Procesos Totales</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AlertCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-red-50 text-red-600 rounded-full">Riesgo</span>
          </div>
          <div className="text-3xl font-bold">{metrics?.critical_processes_count || 0}</div>
          <div className="text-sm text-gray-500">Puntos únicos de fallo (Bus Factor = 1)</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl font-bold">
            {metrics ? (metrics.total_processes - metrics.critical_processes_count) : 0}
          </div>
          <div className="text-sm text-gray-500">Procesos con Backup sólido</div>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-bold mb-4">Mapa de Dependencia (Bus Factor)</h2>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs font-medium uppercase">
              <tr>
                <th className="px-6 py-4">Proceso</th>
                <th className="px-6 py-4">Bus Factor</th>
                <th className="px-6 py-4">Personas Clave</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {metrics?.bus_factor_map.map((item) => (
                <tr key={item.process_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{item.process_name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      item.bus_factor <= 1 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {item.bus_factor} personas
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.critical_people.join(', ') || 'Sin asignar'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/processes/${item.process_id}`} className="inline-flex items-center text-primary hover:underline group">
                      Detalles <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
