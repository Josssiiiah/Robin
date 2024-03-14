import { json } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import type { ActionFunctionArgs } from '@remix-run/node'
import { createSupabaseServerClient } from '~/supabase.server'


export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabaseClient, headers } = createSupabaseServerClient(request)
  const formData = await request.formData()

  const {  } = await supabaseClient.auth.signInWithOtp({
    email: formData.get('email') as string,
    options: {
      emailRedirectTo: 'http://localhost:3000/auth/callback',
    },
  })

  // GOOGLE AUTH 
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  
  // just for this example
  // if there is no error, we show "Please check you email" message
  if (error) {
    return json({ success: false }, { headers })
  }
  return json({ success: true }, { headers })
}


  
export default function SignIn() {


  const actionResponse = useActionData<typeof action>()
  return (
    <>
      {!actionResponse?.success ? (
        <Form method="post">
          <input type="email" name="email" placeholder="Your Email" required />
          <br />
          <button type="submit">Sign In</button>
        </Form>
      ) : (
        <h3>Please check your email.</h3>
      )}
      <div
        id="g_id_onload"
        data-client_id="<client ID>"
        data-context="signin"
        data-ux_mode="popup"
        data-callback="handleSignInWithGoogle"
        data-nonce=""
        data-auto_select="true"
        data-itp_support="true"
        ></div>

        <div
        data-type="standard"
        data-shape="pill"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
        ></div>

    </>
  )
}
