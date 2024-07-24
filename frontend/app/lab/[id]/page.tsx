"use client";

import { ContainerInspectInfo } from "@/types";
import { get } from "http";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const LabPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();

  const [notebook, setNotebook] = useState<null | ContainerInspectInfo>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getNotebook = async () => {
      const res = await fetch(`http://localhost:8080/apis/containers/${id}`);
      const data = await res.json();
      setNotebook(data);
      setIsLoading(false);
    };
    getNotebook();
  }, [id]);

  if (!notebook) return <></>;

  return (
    <div className="min-h-[100vh]">
      <nav className="h-[5vh] border shadow p-1 px-4">
        <div className="flex flex-row items-center gap-4 h-full">
          <h1 className=" font-semibold cursor-pointer underline" onClick={() => router.push("/")}>
            {"< Back"}
          </h1>
          <div>
            <h1>{notebook.Name}</h1>
          </div>
        </div>
      </nav>
      <iframe
        src={`http://${process.env.NEXT_PUBLIC_HOST_IP}:${notebook.HostConfig.PortBindings["8888/tcp"][0].HostPort}`}
        className="w-full h-[95vh]"
      />
    </div>
  );
};

export default LabPage;
