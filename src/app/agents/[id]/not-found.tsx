export default function NotFound() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Agent Not Found</h2>
        <p className="text-muted-foreground">The agent youre looking for doesnt exist or has been deleted.</p>
      </div>
    </div>
  );
}
