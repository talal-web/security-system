export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">403 Unauthorized</h1>

        <p className="mt-2 text-gray-500">
          You do not have permission to access this page.
        </p>
      </div>
    </div>
  );
}
