import Link from "next/link";
export default function ForgotPasswordPage() {
  return (
    <div className="container py-16 max-w-lg">
      <h1 className="text-2xl font-bold">Password recovery</h1>
      <p className="my-4">
        Email password recovery is not available yet. If you created your
        account with GitHub or Google, use the same provider to sign in.
      </p>
      <Link href="/account/login" className="underline">
        Back to login
      </Link>
    </div>
  );
}
