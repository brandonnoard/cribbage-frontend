import { Link } from "react-router-dom";
import { Alert } from "../components/ui/Alert";

type AccessDeniedPageProps = Readonly<{
  message?: string;
}>;

export function AccessDeniedPage({
  message = "You do not have permission to view this page.",
}: AccessDeniedPageProps) {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Alert title="Access denied" message={message} />
      <Link to="/users" className="text-sm text-emerald-400 hover:underline">
        Back to users
      </Link>
    </div>
  );
}
