import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import Dockerode from "dockerode";
import portfinder from "portfinder";

dotenv.config();

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(cors());

// Docker
const docker = new Dockerode();

const containerIds: string[] = [];

const JUPYTER_TYPES = [
  {
    value: "scipy-notebook",
    label: "Scripy Notebook (Basic)",
    src: "quay.io/jupyter/scipy-notebook",
  },
  {
    value: "tensorflow-notebook",
    label: "Tensorflow Notebook",
    src: "quay.io/jupyter/tensorflow-notebook",
  },
  { value: "pytorch-notebook", label: "Pytouch Notebook", src: "quay.io/jupyter/pytorch-notebook" },
  {
    value: "datascience-notebook",
    label: "Data Science Notebook",
    src: "quay.io/jupyter/datascience-notebook",
  },
  { value: "pyspark-notebook", label: "Pyspark Notebook", src: "quay.io/jupyter/pyspark-notebook" },
  {
    value: "all-spark-notebook",
    label: "All Spark Notebook",
    src: "quay.io/jupyter/all-spark-notebook",
  },
];

app.get("/apis/containers", (req: Request, res: Response) => {
  docker.listContainers((err, containers) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
    res.json(containers);
  });
});

interface CreateContainerResponseDTO {
  success: boolean;
  message: string;
  containerId?: string;
  container?: Dockerode.Container;
}

const getAvailablePort = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    portfinder.getPort((err, port) => {
      if (err) {
        reject(err);
      }
      resolve(port);
    });
  });
};

const createContainer = (
  selectedJypyterType: string,
  name: string,
  password: string,
  port: number
): Promise<CreateContainerResponseDTO> => {
  const opt = {
    headers: {
      "Content-Security-Policy": "frame-ancestors 'self' http://localhost localhost *;",
    },
  };
  return new Promise((resolve, reject) => {
    docker
      .createContainer({
        Image: selectedJypyterType,
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true,
        OpenStdin: false,
        StdinOnce: false,
        HostConfig: {
          CpuCount: 1,
          Memory: 256000000,
          PortBindings: {
            "8888/tcp": [
              {
                HostPort: String(port),
              },
            ],
          },
        },
        Cmd: [
          `start-notebook.py`,
          `--NotebookApp.token=${password}`,
          `--NotebookApp.password=${password}`,
          `--ServerApp.tornado_settings=${JSON.stringify(opt)}`,
        ],
      })
      .then((container) => {
        containerIds.push(container.id);
        container.start().then(() => {
          console.log(container);
          resolve({
            success: true,
            message: "Container created successfully",
            containerId: container.id,
            container: container,
          });
        });
      })
      .catch((err) => {
        console.error(err);
        reject({ success: false, message: "Internal Server Error" });
      });
  });
};

app.get("/apis/containers/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const container = docker.getContainer(id);
  container.inspect((err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
    res.json(data);
  });
});

app.get("/apis/images", (req: Request, res: Response) => {
  docker.listImages((err, images) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
    res.json(images);
  });
});

app.post("/apis/containers", async (req: Request, res: Response) => {
  console.log(req.body);
  const { image, name, password } = req.body;
  const selectedJypyterType =
    JUPYTER_TYPES.find((e) => e.value === image)?.src || "quay.io/jupyter/scipy-notebook";

  docker.pull(`${selectedJypyterType}:latest`, (err: any, stream: any) => {
    if (err) console.error(err);

    docker.modem.followProgress(stream, onFinished, onProgress);

    async function onFinished(err: any, output: any) {
      if (err) console.error(err);
      console.log(output);

      let port;
      try {
        port = await getAvailablePort();

        createContainer(selectedJypyterType, name, password, port).then((result) => {
          res.statusCode = result.success ? 200 : 500;
          res.json(result);
        });
      } catch (err) {
        console.error(err);
      }
    }
    function onProgress(event: any) {
      console.log(event);
    }
  });
});

app.post("/", (req: Request, res: Response) => {
  console.log(req.body);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
