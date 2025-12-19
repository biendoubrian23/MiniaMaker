// Redirection /login vers /auth
import { redirect } from 'next/navigation';

export default function LoginPage() {
  redirect('/auth');
}
