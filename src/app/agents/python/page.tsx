"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function PythonAgentPage() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPythonData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/python");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setResult("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Button onClick={fetchPythonData} disabled={loading}>
        {loading ? "Loading..." : "Fetch Python Data"}
      </Button>
      {result && (
        <div className="mt-4 p-2 border rounded">
          <h2 className="text-lg font-semibold">Result:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
