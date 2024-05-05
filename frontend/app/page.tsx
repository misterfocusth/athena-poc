"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Link,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { get } from "http";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const JUPYTER_TYPES = [
    { value: "scipy-notebook", label: "Scripy Notebook (Basic)" },
    { value: "tensorflow-notebook", label: "Tensorflow Notebook" },
    { value: "pytorch-notebook", label: "Pytouch Notebook" },
    { value: "datascience-notebook", label: "Data Science Notebook" },
    { value: "pyspark-notebook", label: "Pyspark Notebook" },
    { value: "all-spark-notebook", label: "All Spark Notebook" },
  ];

  const [newJupyterConfig, setNewJupyterConfig] = useState({
    image: "",
    name: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notebooks, setNotebooks] = useState([]);

  const router = useRouter();

  const getAllJupyter = async () => {
    const res = await fetch("http://localhost:8080/apis/containers");
    const data = await res.json();
    setNotebooks(data);
  };

  const StatingNotebookInstance = (notebook: any) => {
    const [isReady, setIsReady] = useState(false);

    setTimeout(() => {
      setIsReady(true);
    }, 5000);

    if (!isReady) {
      return (
        <div className="flex flex-row items-center gap-4 h-full">
          <div>
            <h1>Starting Notebook Instance</h1>
          </div>
        </div>
      );
    }

    return (
      <Link showAnchorIcon href={`http://localhost:3000/lab/${notebook.notebook.Id}`}>
        Open Notebook
      </Link>
    );
  };

  const handleCreateImage = () => {
    setIsLoading(true);

    fetch("http://localhost:8080/apis/containers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newJupyterConfig),
    })
      .then((res) => {
        res.json().then(async (res) => {
          await getAllJupyter();
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    getAllJupyter();
  }, []);

  return (
    <main className=" bg-slate-400 min-h-screen p-14">
      <div>
        <h1 className="text-3xl font-bold">👋🏻 Welcome Back, Sila</h1>
        <div className="mt-6">
          <h1 className="text-xl font-semibold">Your Jupyter Notebook(s)</h1>

          <div className="grid grid-cols-4 gap-6 mt-6">
            {notebooks.map((notebook: any) => (
              <Card className="max-w-[400px]" key={notebook.id}>
                <CardHeader className="flex gap-3">
                  <div className="flex flex-col">
                    <p className="text-md">{notebook.Names}</p>
                    <p className="text-small">{notebook.Image}</p>
                    <p className="text-small text-default-500">{notebook.Status}</p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio fugiat nulla
                  quibusdam ad pariatur ut, nihil atque sapiente iste amet labore suscipit sit
                  voluptatem beatae? Corrupti labore nesciunt fugit? Temporibus?
                </CardBody>
                <Divider />
                <CardFooter>
                  {(Date.now() - notebook.Created * 1000) / 1000 / 60 >= 0.15 ? (
                    <Link showAnchorIcon href={`http://localhost:3000/lab/${notebook.Id}`}>
                      Open Notebook
                    </Link>
                  ) : (
                    <StatingNotebookInstance notebook={notebook} />
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h1 className="text-xl font-semibold">Start a New Jupyter Notebook</h1>

          <div className="mt-4 flex flex-col gap-4">
            <Select
              label="Selecting an Image"
              placeholder="Select an jupyter notebook image"
              labelPlacement="inside"
              className="max-w-xl"
              disableSelectorIconRotation
              onChange={(e) => setNewJupyterConfig({ ...newJupyterConfig, image: e.target.value })}
            >
              {JUPYTER_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </Select>

            <Input
              type="Notebook Name"
              label="Your jupyter notebook name"
              placeholder="Enter jupyter notebook name"
              className="max-w-xl"
              onChange={(e) =>
                setNewJupyterConfig({ ...newJupyterConfig, name: e.currentTarget.value })
              }
            />
            <Input
              type="Notebook Password"
              label="Password for your notebook"
              placeholder="Enter password for your notebook"
              className="max-w-xl"
              onChange={(e) =>
                setNewJupyterConfig({ ...newJupyterConfig, password: e.currentTarget.value })
              }
            />

            <Button
              className="max-w-xl"
              color="primary"
              onClick={handleCreateImage}
              isLoading={isLoading}
            >
              Create a new jupyter notebook
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
