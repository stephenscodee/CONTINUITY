import { create } from 'zustand'

const useStore = create((set) => ({
  user: null,
  processes: [],
  setUser: (user) => set({ user }),
  setProcesses: (processes) => set({ processes }),
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null })
  }
}))

export default useStore
