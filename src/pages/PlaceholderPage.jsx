import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PlaceholderPage({ title }) {
  const [params] = useSearchParams();
  const query = params.get("q");
  const category = params.get("category");

  return (
    <main className="grid min-h-screen place-items-center bg-[#5c4638] px-6 pt-24 text-center">
      <div className="animate-fade-up">
        <h1 className="font-display text-4xl text-white sm:text-6xl">
          {title}
        </h1>
        {query && (
          <p className="mt-4 text-white/70">
            Search results for &ldquo;{query}&rdquo;
          </p>
        )}
        {category && (
          <p className="mt-4 capitalize text-white/70">Category: {category}</p>
        )}
        <p className="mt-4 text-sm font-light text-white/60">
          This page is coming soon.
        </p>
        <Link
          to="/"
          className="group mt-8 inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-white hover:text-[#3b2a20]"
        >
          <ArrowLeft
            size={16}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          Back to home
        </Link>
      </div>
    </main>
  );
}
