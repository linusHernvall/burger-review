import ReviewForm from "./ReviewForm";

export default function NewReview() {
  return (
    <main className="flex min-h-dvh flex-col items-center px-4 py-8 lg:p-20">
      <div className="w-full max-w-2xl space-y-8">
        <h1 className="text-4xl font-bold capitalize">Add new burger</h1>
        <ReviewForm />
      </div>
    </main>
  );
}
