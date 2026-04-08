import { useEffect } from "react"

export default function ExportModal({ isOpen, onClose, children }) {
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl overflow-visible rounded-2xl bg-white p-6 shadow-xl">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  )
}
