import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <main className="absolute inset-0 flex items-center justify-center w-full bg-gray-100 dark:bg-gray-950">
      <div className="mx-auto max-w-screen-2xl p-4 w-full">
        <div className="flex flex-col items-center justify-center w-full">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
