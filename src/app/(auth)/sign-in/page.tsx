"use client";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useQuery } from "@tanstack/react-query";
import { Loader, Loader2 } from "lucide-react";

const page = () => {
  const [value, setValue] = useState("");
  const debounced = useDebounceCallback(setValue, 500);

  const { data, isFetching } = useQuery({ queryKey: ["todos"], queryFn: fetchTodos });

  async function fetchTodos() {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    if (!response.ok) {
      throw new Error("Error fetching todos");
    }
    return response.json();
  }

  if(isFetching){
    return (
      <Loader className="animate-spin"/>
    )
  }

  return (
    <>
      <div>Debounced value {value}</div>
      <Input onChange={(e) => debounced(e.target.value)} />
      <p>{JSON.stringify(data)}</p>
    </>
  );
};

export default page;
