import { redirect } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { createSupabaseServerClient } from '~/supabase.server'



export const loader = async ({ request }: LoaderFunctionArgs) => {
    console.log("logout")
  const { supabaseClient, headers } = createSupabaseServerClient(request)
  // check if user is logged in
  const {
    data: { session },
  } = await supabaseClient.auth.getSession()
  if (!session?.user) {
    return redirect('/')
  }
  // sign out
  await supabaseClient.auth.signOut()
  return redirect('/', {
    headers,
  })
}