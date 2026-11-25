// Redirect catch: /signin → /auth/login
import { redirect } from 'next/navigation';

export default function SignInRedirectPage() {
  redirect('/auth/login');
}
