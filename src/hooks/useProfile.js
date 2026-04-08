import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'liferank_profile'
const PROFILE_EVENT = 'liferank_profile_change'

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { name: '', avatar: '' }
    const parsed = JSON.parse(raw)
    return {
      name: typeof parsed.name === 'string' ? parsed.name : '',
      avatar: typeof parsed.avatar === 'string' ? parsed.avatar : '',
    }
  } catch {
    return { name: '', avatar: '' }
  }
}

export function useProfile() {
  const [profile, setProfile] = useState(loadProfile)

  useEffect(() => {
    function syncFromStorage() {
      setProfile(loadProfile())
    }
    function onStorage(e) {
      if (e.key === STORAGE_KEY || e.key === null) syncFromStorage()
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener(PROFILE_EVENT, syncFromStorage)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(PROFILE_EVENT, syncFromStorage)
    }
  }, [])

  const updateProfile = useCallback((updates) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* quota or private mode */
      }
      return next
    })
    queueMicrotask(() => window.dispatchEvent(new Event(PROFILE_EVENT)))
  }, [])

  return { profile, updateProfile }
}
