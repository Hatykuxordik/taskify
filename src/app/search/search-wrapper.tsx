"use client";

import { Suspense } from "react";
import SearchPage from "./page";

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchPage />
    </Suspense>
  );
}


