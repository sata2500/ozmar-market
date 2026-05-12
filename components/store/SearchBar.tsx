"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(searchParams.get("search") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {isOpen ? (
        <form 
          onSubmit={handleSearch}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            background: "var(--color-surface)", 
            border: "1px solid var(--color-border)", 
            borderRadius: "var(--border-radius)",
            overflow: "hidden"
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ürün ara..."
            autoFocus
            style={{
              padding: "0.5rem 1rem",
              border: "none",
              background: "transparent",
              color: "var(--color-text)",
              outline: "none",
              width: "200px"
            }}
          />
          <button 
            type="submit" 
            style={{ 
              background: "transparent", 
              border: "none", 
              padding: "0.5rem", 
              cursor: "pointer", 
              color: "var(--color-text-muted)" 
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            style={{ 
              background: "transparent", 
              border: "none", 
              padding: "0.5rem", 
              cursor: "pointer", 
              color: "var(--color-text-muted)" 
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </form>
      ) : (
        <button 
          onClick={() => setIsOpen(true)} 
          aria-label="Arama Aç"
          style={{
            background: "transparent",
            border: "none",
            color: "var(--color-text)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.5rem",
            opacity: 0.8,
            transition: "opacity 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "0.8"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      )}
    </div>
  );
}
