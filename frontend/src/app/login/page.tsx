// Redirect catch: /login → /auth/login (preserving any ?from= param)
import { redirect } from 'next/navigation';

export default function LoginRedirectPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const from = searchParams?.from ? `?from=${searchParams.from}` : '';
  redirect(`/auth/login${from}`);
}
