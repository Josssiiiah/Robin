import { ActionFunctionArgs } from "@remix-run/node";
import { createServerClient, parse, serialize } from "@supabase/ssr";


export async function action({ request }: ActionFunctionArgs) {
    console.log("logout action")
    const cookies = parse(request.headers.get("Cookie") ?? "");
    const headers = new Headers();
  
    const supabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(key) {
            return cookies[key];
          },
          set(key, value, options) {
            headers.append("Set-Cookie", serialize(key, value, options));
          },
          remove(key, options) {
            headers.append("Set-Cookie", serialize(key, "", options));
          },
        },
      },
    );

    async function signOut() {
        const { error } = await supabase.auth.signOut()

        if (error) {
          console.error('Error logging out:', error)
          return error
        }
      }
  
    headers.append("Set-Cookie", serialize("session", "", { path: "/", expires: new Date(0) }));
    headers.append("Set-Cookie", serialize("refresh_token", "", { path: "/", expires: new Date(0) }));
    await signOut()
    console.log("sign out successful")
    return null;

}