import React, { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { createClient } from "@supabase/supabase-js";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function mutation() {
  const mutation = useMutation({
    mutationFn: () =>
      fetch("http://127.0.0.1:5000/api/mutate", {
        method: "POST",
      }),
  });

  return (
    <div>
      {mutation.isPending ? (
        "Adding todo..."
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>Todo added!</div> : null}

          <button
            onClick={() => {
              mutation.mutate();
            }}
          >
            Create Todo
          </button>
        </>
      )}
    </div>
  );
}
