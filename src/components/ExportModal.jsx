import { useEffect } from "react"

export default function ExportModal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return
    function handleEsc(e) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-colors duration-200 dark:bg-black/60"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-4xl overflow-visible rounded-2xl bg-white p-6 shadow-xl transition-colors duration-200 dark:bg-gray-800 dark:ring-1 dark:ring-white/10"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 transition hover:text-black dark:text-gray-500 dark:hover:text-gray-200"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  )
}
