import { lazy, Suspense, type ComponentType, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Spinner } from "./components/ui/Spinner";
import { PermissionRoute } from "./auth/PermissionRoute";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { AppShell } from "./components/layout/AppShell";
import { WelcomePage } from "./pages/WelcomePage";

function lazyNamed<T extends Record<string, ComponentType<unknown>>>(
  importFn: () => Promise<T>,
  exportName: keyof T & string,
) {
  return lazy(() =>
    importFn().then((module) => ({
      default: module[exportName] as ComponentType<unknown>,
    })),
  );
}

function withSuspense(element: ReactNode, label: string): ReactNode {
  return <Suspense fallback={<Spinner label={label} />}>{element}</Suspense>;
}

const UsersListPage = lazyNamed(() => import("./pages/UsersListPage"), "UsersListPage");
const UserDetailPage = lazyNamed(() => import("./pages/UserDetailPage"), "UserDetailPage");
const UserCreatePage = lazyNamed(() => import("./pages/UserCreatePage"), "UserCreatePage");
const LoginPage = lazyNamed(() => import("./pages/LoginPage"), "LoginPage");

export function App() {
  return (
    <Routes>
      <Route path="/login" element={withSuspense(<LoginPage />, "Loading…")} />

      <Route element={<AppShell />}>
        <Route index element={<WelcomePage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="users" element={withSuspense(<UsersListPage />, "Loading users…")} />
          <Route
            path="users/new"
            element={
              <PermissionRoute
                permission="user:create"
                deniedMessage="You need the user:create permission to create accounts."
              >
                {withSuspense(<UserCreatePage />, "Loading…")}
              </PermissionRoute>
            }
          />
          <Route path="users/:id" element={withSuspense(<UserDetailPage />, "Loading user…")} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
