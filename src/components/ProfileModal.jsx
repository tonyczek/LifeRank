import { useEffect, useState } from 'react'
import { useProfile } from '../hooks/useProfile'

export function ProfileModal({ open, onClose }) {
  const { profile, updateProfile } = useProfile()
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    if (!open) return
    setName(String(profile.name ?? '').slice(0, 20))
    setAvatar(profile.avatar || '')
  }, [open, profile.name, profile.avatar])

  useEffect(() => {
    if (!open) return
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => setAvatar(String(reader.result || ''))
    reader.readAsDataURL(file)
  }

  function handleSave(e) {
    e.preventDefault()
    updateProfile({
      name: name.trim().slice(0, 20),
      avatar: typeof avatar === 'string' ? avatar.trim() : '',
    })
    onClose?.()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 backdrop-blur-sm"
      onClick={() => onClose?.()}
      role="presentation"
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg px-2 py-1 text-sm text-[#6E6E73] transition hover:bg-black/5 hover:text-[#1D1D1F]"
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold tracking-tight text-[#1D1D1F]">Profile</h2>
        <p className="mt-1 text-sm text-[#6E6E73]">Shown on exported ranking cards.</p>

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-[#1D1D1F]">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 20))}
              maxLength={20}
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
              placeholder="Your name"
            />
            <p className="mt-1 text-xs text-[#6E6E73]">{name.length}/20 characters</p>
          </div>

          <div>
            <label className="text-sm font-medium text-[#1D1D1F]">Avatar URL</label>
            <input
              value={avatar.startsWith('data:') ? '' : avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
              placeholder="https://… or leave empty"
            />
            {avatar.startsWith('data:') ? (
              <p className="mt-1 text-xs text-[#6E6E73]">Using uploaded image. Pick a new file or paste a URL to replace.</p>
            ) : null}
          </div>

          <div>
            <label className="text-sm font-medium text-[#1D1D1F]">Avatar image file</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 block w-full text-sm text-[#6E6E73] file:mr-3 file:rounded-lg file:border-0 file:bg-[#F5F5F7] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[#1D1D1F]"
            />
          </div>

          {avatar ? (
            <div className="flex items-center gap-3 rounded-xl bg-[#F5F5F7] p-3">
              <img src={avatar} alt="" className="h-12 w-12 rounded-full object-cover ring-1 ring-black/10" />
              <button
                type="button"
                onClick={() => setAvatar('')}
                className="text-xs font-medium text-[#6E6E73] underline transition hover:text-[#1D1D1F]"
              >
                Remove avatar
              </button>
            </div>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-[#1D1D1F] transition hover:bg-black/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#0071E3] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
