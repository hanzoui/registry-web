import { HttpResponse, http } from "msw";
import {
  ListNodesForPublisherV2200,
  type Node,
  NodeStatus,
  type Publisher,
  PublisherStatus,
  type User,
} from "../api/generated";
import { CAPI } from "./apibase";

// Mock data
const mockNodes: Node[] = [
  {
    id: "example-hanzo-studio-custom-node",
    name: "Example Hanzo Studio Custom Node",
    description: "A demonstration custom node for Hanzo Studio showcasing basic functionality",
    author: "A Hanzo Studio Publisher",
    repository: "https://github.com/example/hanzo-studio-custom-node",
    github_stars: 156,
    downloads: 1250,
    publisher: {
      id: "a-comfy-ui-publisher",
      name: "A Hanzo Studio Publisher",
      description: "Professional Hanzo Studio extension publisher",
      logo: "https://avatars.githubusercontent.com/u/comfyui?v=4",
      status: PublisherStatus.PublisherStatusActive,
      createdAt: "2023-04-01T00:00:00Z",
    },
    tags: ["example", "custom", "demo"],
    latest_version: {
      version: "1.0.0",
      downloadUrl: "https://api.example.com/downloads/example-hanzo-studio-custom-node/v1.0.0.zip",
    },
    license: "MIT",
    icon: "https://raw.githubusercontent.com/example/hanzo-studio-custom-node/main/icon.png",
    status: NodeStatus.NodeStatusActive,
    search_ranking: 2,
    preempted_comfy_node_names: ["ExampleNode", "CustomProcessor"],
    created_at: "2023-09-01T00:00:00Z",
  },
  {
    id: "hanzo-studio-animatediff-evolved",
    name: "Hanzo Studio-AnimateDiff-Evolved",
    description: "Advanced AnimateDiff implementation for Hanzo Studio",
    author: "Kosinkadink",
    repository: "https://github.com/Kosinkadink/Hanzo Studio-AnimateDiff-Evolved",
    github_stars: 892,
    downloads: 5420,
    publisher: {
      id: "kosinkadink",
      name: "Kosinkadink",
      description: "Hanzo Studio node developer",
      logo: "https://avatars.githubusercontent.com/u/7365912?v=4",
      status: PublisherStatus.PublisherStatusActive,
      createdAt: "2023-01-01T00:00:00Z",
    },
    tags: ["animation", "diffusion", "video"],
    latest_version: {
      version: "3.0.0",
      downloadUrl: "https://api.example.com/downloads/hanzo-studio-animatediff-evolved/v3.0.0.zip",
    },
    license: "MIT",
    icon: "https://raw.githubusercontent.com/Kosinkadink/Hanzo Studio-AnimateDiff-Evolved/main/icon.png",
    status: NodeStatus.NodeStatusActive,
    search_ranking: 5,
    preempted_comfy_node_names: ["AnimateDiffEvolvedLoader", "AnimateDiffSampler"],
    created_at: "2023-06-01T00:00:00Z",
  },
  {
    id: "hanzo-studio-manager",
    name: "Hanzo Manager",
    description: "Extension manager for Hanzo Studio",
    author: "ltdrdata",
    repository: "https://github.com/ltdrdata/Hanzo Manager",
    github_stars: 1245,
    downloads: 8934,
    publisher: {
      id: "ltdrdata",
      name: "ltdrdata",
      description: "Hanzo Manager developer",
      logo: "https://avatars.githubusercontent.com/u/128333288?v=4",
      status: PublisherStatus.PublisherStatusActive,
      createdAt: "2023-02-01T00:00:00Z",
    },
    tags: ["manager", "utility", "tools"],
    latest_version: {
      version: "2.15.0",
      downloadUrl: "https://api.example.com/downloads/hanzo-studio-manager/v2.15.0.zip",
    },
    license: "GPL-3.0",
    icon: "https://raw.githubusercontent.com/ltdrdata/Hanzo Manager/main/icon.png",
    status: NodeStatus.NodeStatusActive,
    search_ranking: 3,
    preempted_comfy_node_names: ["ManagerInstaller", "ManagerUpdater"],
    created_at: "2023-08-01T00:00:00Z",
  },
];

const mockPublishers: Publisher[] = [
  {
    id: "a-comfy-ui-publisher",
    name: "Example Hanzo Studio Publisher",
    description: "Professional Hanzo Studio extension publisher",
    logo: "https://avatars.githubusercontent.com/u/comfyui?v=4",
    status: PublisherStatus.PublisherStatusActive,
    createdAt: "2023-04-01T00:00:00Z",
  },
  {
    id: "kosinkadink",
    name: "Kosinkadink",
    description: "Hanzo Studio node developer",
    logo: "https://avatars.githubusercontent.com/u/7365912?v=4",
    status: PublisherStatus.PublisherStatusActive,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "ltdrdata",
    name: "ltdrdata",
    description: "Hanzo Manager developer",
    logo: "https://avatars.githubusercontent.com/u/128333288?v=4",
    status: PublisherStatus.PublisherStatusActive,
    createdAt: "2023-02-01T00:00:00Z",
  },
  {
    id: "snomiao",
    name: "@snomiao",
    description: "Hanzo Studio node developer",
    logo: "https://avatars.githubusercontent.com/u/snomiao?v=4",
    status: PublisherStatus.PublisherStatusActive,
    createdAt: "2023-03-01T00:00:00Z",
  },
];

const mockUser: User = {
  id: "a-comfy-ui-user",
  name: "Example Hanzo Studio User",
  email: "a-comfy-ui-user@example.com",
  isAdmin: false,
  isApproved: true,
};

export { CAPI };

export const handlers = [
  // Users endpoints
  http.get(CAPI("/users"), () => {
    return HttpResponse.json(mockUser);
  }),
  // Nodes endpoints
  http.get(CAPI("/nodes"), ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const searchTerm = url.searchParams.get("search") || "";

    let filteredNodes = mockNodes;
    if (searchTerm) {
      filteredNodes = mockNodes.filter(
        (node) =>
          node.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          node.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    const total = filteredNodes.length;
    const nodes = filteredNodes.slice(offset, offset + limit);

    const response: ListNodesForPublisherV2200 = {
      nodes,
      total,
      limit,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(total / limit),
    };

    return HttpResponse.json(response);
  }),

  http.get(CAPI("/nodes/:id"), ({ params }) => {
    const nodeId = params.id as string;
    const node = mockNodes.find((n) => n.id === nodeId);

    if (!node) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(node);
  }),

  // List all Publishers endpoints
  http.get(CAPI("/publishers"), () => {
    return HttpResponse.json({
      publishers: mockPublishers,
      total: mockPublishers.length,
    });
  }),

  http.get(CAPI("/publishers/:id"), ({ params }) => {
    const publisherId = params.id as string;
    const publisher = mockPublishers.find((p) => p.id === publisherId);

    if (!publisher) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(publisher);
  }),

  // Featured nodes
  http.get(CAPI("/nodes/featured"), () => {
    return HttpResponse.json({
      nodes: mockNodes.slice(0, 3),
      total: 3,
    });
  }),

  // Node versions endpoints
  http.get(CAPI("/nodes/:id/versions"), ({ params, request }) => {
    const nodeId = params.id as string;
    const node = mockNodes.find((n) => n.id === nodeId);

    if (!node) {
      return new HttpResponse(null, { status: 404 });
    }

    const url = new URL(request.url);
    const statuses = url.searchParams.getAll("statuses");

    const mockVersions = [
      {
        id: "v1",
        version: "3.0.0",
        changelog: "Major update with new features and bug fixes",
        createdAt: "2024-01-15T10:30:00Z",
        status: "active",
        downloadUrl: `https://api.example.com/downloads/${nodeId}/v3.0.0.zip`,
      },
      {
        id: "v2",
        version: "2.1.0",
        changelog: "Performance improvements and minor bug fixes",
        createdAt: "2023-12-01T14:20:00Z",
        status: "active",
        downloadUrl: `https://api.example.com/downloads/${nodeId}/v2.1.0.zip`,
      },
      {
        id: "v3",
        version: "2.0.0",
        changelog: "Breaking changes - updated API interface",
        createdAt: "2023-10-15T09:45:00Z",
        status: "active",
        downloadUrl: `https://api.example.com/downloads/${nodeId}/v2.0.0.zip`,
      },
    ];

    return HttpResponse.json(mockVersions);
  }),

  // User permissions endpoints
  http.get(CAPI("/publishers/:publisherId/nodes/:nodeId/permissions"), ({ params }) => {
    const publisherId = params.publisherId as string;
    const nodeId = params.nodeId as string;

    // Mock permissions - canEdit true for demo purposes
    return HttpResponse.json({
      canEdit: false,
      canDelete: false,
      canPublish: false,
    });
  }),

  // User's publishers
  http.get(CAPI("/users/publishers"), () => {
    return HttpResponse.json(mockPublishers.slice(0, 1)); // Example Hanzo Studio Publisher
  }),

  // Default fallback for unmatched requests
  http.get(CAPI("/*"), ({ request }) => {
    console.warn(`Unmatched request: ${request.method} ${request.url}`);
    return new HttpResponse(null, { status: 404 });
  }),
];
