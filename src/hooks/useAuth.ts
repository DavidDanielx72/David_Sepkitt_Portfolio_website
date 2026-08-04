import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Session } from '@supabase/supabase-js'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkAdmin = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setIsAdmin(false)
      return
    }
    const { data, error } = await supabase.rpc('is_site_admin')
    if (error) {
      setIsAdmin(false)
      return
    }
    setIsAdmin(!!data)
  }, [])

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      checkAdmin(data.session?.user?.id).finally(() => setLoading(false))
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      checkAdmin(session?.user?.id).finally(() => setLoading(false))
    })

    return () => {
      mounted = false
      authListener.subscription.unsubscribe()
    }
  }, [checkAdmin])

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setIsAdmin(false)
  }, [])

  return { session, isAdmin, loading, signIn, signOut }
}
