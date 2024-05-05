interface HostConfig {
  AutoRemove?: boolean | undefined;
  Binds?: string[] | undefined;
  ContainerIDFile?: string | undefined;
  LogConfig?:
    | {
        Type: string;
        Config: any;
      }
    | undefined;
  NetworkMode?: string | undefined;
  PortBindings?: any;
  VolumeDriver?: string | undefined;
  VolumesFrom?: any;
  CapAdd?: any;
  CapDrop?: any;
  Dns?: any[] | undefined;
  DnsOptions?: any[] | undefined;
  DnsSearch?: string[] | undefined;
  ExtraHosts?: any;
  GroupAdd?: string[] | undefined;
  IpcMode?: string | undefined;
  Cgroup?: string | undefined;
  Links?: any;
  OomScoreAdj?: number | undefined;
  PidMode?: string | undefined;
  Privileged?: boolean | undefined;
  PublishAllPorts?: boolean | undefined;
  ReadonlyRootfs?: boolean | undefined;
  SecurityOpt?: any;
  StorageOpt?: { [option: string]: string } | undefined;
  Tmpfs?: { [dir: string]: string } | undefined;
  UTSMode?: string | undefined;
  UsernsMode?: string | undefined;
  ShmSize?: number | undefined;
  Sysctls?: { [index: string]: string } | undefined;
  Runtime?: string | undefined;
  ConsoleSize?: number[] | undefined;
  Isolation?: string | undefined;
  MaskedPaths?: string[] | undefined;
  ReadonlyPaths?: string[] | undefined;
  CpuShares?: number | undefined;
  CgroupParent?: string | undefined;
  BlkioWeight?: number | undefined;
  BlkioWeightDevice?: any;
  BlkioDeviceReadBps?: any;
  BlkioDeviceWriteBps?: any;
  BlkioDeviceReadIOps?: any;
  BlkioDeviceWriteIOps?: any;
  CpuPeriod?: number | undefined;
  CpuQuota?: number | undefined;
  CpusetCpus?: string | undefined;
  CpusetMems?: string | undefined;
  Devices?: any;
  DeviceCgroupRules?: string[] | undefined;
  DiskQuota?: number | undefined;
  KernelMemory?: number | undefined;
  Memory?: number | undefined;
  MemoryReservation?: number | undefined;
  MemorySwap?: number | undefined;
  MemorySwappiness?: number | undefined;
  NanoCpus?: number | undefined;
  OomKillDisable?: boolean | undefined;
  Init?: boolean | undefined;
  PidsLimit?: number | undefined;
  CpuCount?: number | undefined;
  CpuPercent?: number | undefined;
  CpuRealtimePeriod?: number | undefined;
  CpuRealtimeRuntime?: number | undefined;
}

export interface ContainerInspectInfo {
  Id: string;
  Created: string;
  Path: string;
  Args: string[];
  State: {
    Status: string;
    Running: boolean;
    Paused: boolean;
    Restarting: boolean;
    OOMKilled: boolean;
    Dead: boolean;
    Pid: number;
    ExitCode: number;
    Error: string;
    StartedAt: string;
    FinishedAt: string;
    Health?:
      | {
          Status: string;
          FailingStreak: number;
          Log: Array<{
            Start: string;
            End: string;
            ExitCode: number;
            Output: string;
          }>;
        }
      | undefined;
  };
  Image: string;
  ResolvConfPath: string;
  HostnamePath: string;
  HostsPath: string;
  LogPath: string;
  Name: string;
  RestartCount: number;
  Driver: string;
  Platform: string;
  MountLabel: string;
  ProcessLabel: string;
  AppArmorProfile: string;
  ExecIDs?: string[] | undefined;
  HostConfig: HostConfig;
  GraphDriver: {
    Name: string;
    Data: {
      DeviceId: string;
      DeviceName: string;
      DeviceSize: string;
    };
  };
  Mounts: Array<{
    Name?: string | undefined;
    Source: string;
    Destination: string;
    Mode: string;
    RW: boolean;
    Propagation: string;
  }>;
  Config: {
    Hostname: string;
    Domainname: string;
    User: string;
    AttachStdin: boolean;
    AttachStdout: boolean;
    AttachStderr: boolean;
    ExposedPorts: { [portAndProtocol: string]: {} };
    Tty: boolean;
    OpenStdin: boolean;
    StdinOnce: boolean;
    Env: string[];
    Cmd: string[];
    Image: string;
    Volumes: { [volume: string]: {} };
    WorkingDir: string;
    Entrypoint?: string | string[] | undefined;
    OnBuild?: any;
    Labels: { [label: string]: string };
  };
  NetworkSettings: {
    Bridge: string;
    SandboxID: string;
    HairpinMode: boolean;
    LinkLocalIPv6Address: string;
    LinkLocalIPv6PrefixLen: number;
    Ports: {
      [portAndProtocol: string]: Array<{
        HostIp: string;
        HostPort: string;
      }>;
    };
    SandboxKey: string;
    SecondaryIPAddresses?: any;
    SecondaryIPv6Addresses?: any;
    EndpointID: string;
    Gateway: string;
    GlobalIPv6Address: string;
    GlobalIPv6PrefixLen: number;
    IPAddress: string;
    IPPrefixLen: number;
    IPv6Gateway: string;
    MacAddress: string;
    Networks: {
      [type: string]: {
        IPAMConfig?: any;
        Links?: any;
        Aliases?: any;
        NetworkID: string;
        EndpointID: string;
        Gateway: string;
        IPAddress: string;
        IPPrefixLen: number;
        IPv6Gateway: string;
        GlobalIPv6Address: string;
        GlobalIPv6PrefixLen: number;
        MacAddress: string;
      };
    };
    Node?:
      | {
          ID: string;
          IP: string;
          Addr: string;
          Name: string;
          Cpus: number;
          Memory: number;
          Labels: any;
        }
      | undefined;
  };
}
