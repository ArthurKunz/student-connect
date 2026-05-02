'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { ProfilePictureProps } from '../types/onboarding.types'
import { MAX_BYTES, BUCKET } from '../constants/onboarding.constants'
import { getSession } from '../services/onboarding.service'

export default function ProfilePictureForm ({ onSuccess, onGoBack }: ProfilePictureProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const onPickFile = (picked: File | null) => {
        setError(null)
        if (!picked) return

        if (!picked.type.startsWith('image/')) {
            setError('Bitte ein Bild (JPG, PNG, …) auswählen.')
            return
        }
        if (picked.size > MAX_BYTES) {
            setError('Die Datei darf höchstens 5 MB groß sein.')
            return
        }

        setFile(picked)
        setPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev)
            return URL.createObjectURL(picked)
        })
    }

    const handleContinue = async () => {
        setError(null)
        if (!file) {
            setError('Bitte ein Profilbild auswählen.')
            return
        }

        setUploading(true)
        const { data: { session } } = await getSession()
        if (!session) {
            setUploading(false)
            setError('Du bist nicht angemeldet.')
            return
        }

        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
        const safeExt = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext) ? ext : 'jpg'
        const path = `${session.user.id}/avatar-${Date.now()}.${safeExt}`

        const { error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(path, file, { cacheControl: '3600', upsert: false })

        setUploading(false)

        if (uploadError) {
            setError(uploadError.message)
            return
        }

        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
        onSuccess(urlData.publicUrl)
    }

    return (
        <div className="flex flex-col gap-4 max-w-sm">
            <h2 className="text-lg font-bold">Profilbild</h2>
            <p className="text-sm text-gray-600">Wähle ein Bild aus. Es wird in deinem Profil und auf der Startseite angezeigt.</p>

            <input
                type="file"
                accept="image/*"
                className="text-sm"
                onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
            />

            {previewUrl && (
                <div className="flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={previewUrl}
                        alt="Vorschau Profilbild"
                        className="h-32 w-32 rounded-full object-cover border border-gray-200"
                    />
                </div>
            )}

            {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

            <div className="flex flex-col gap-2">
                <button
                    type="button"
                    className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
                    disabled={uploading || !file}
                    onClick={() => void handleContinue()}
                >
                    {uploading ? 'Wird hochgeladen…' : 'Speichern & weiter'}
                </button>
                <button type="button" className="border border-gray-300 p-2 rounded" onClick={onGoBack}>
                    Zurück
                </button>
            </div>
        </div>
    )
}
