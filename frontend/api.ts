// const BASE_URL = "https://noteapp.foursw.com/api";
const BASE_URL = "http://backend.test/api";

// Get token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

// Set token in localStorage
export const setToken = (token: string): void => {
  localStorage.setItem("auth_token", token);
};

// Remove token from localStorage
export const removeToken = (): void => {
  localStorage.removeItem("auth_token");
};

// Make API request with automatic token attachment
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    return response;
  } catch (error: any) {
    // Re-throw with a more descriptive message for network errors
    if (error.message === "Failed to fetch" || error.name === "TypeError") {
      throw new Error(`لا يمكن الاتصال بالخادم. تأكد من أن الخادم يعمل على ${BASE_URL}`);
    }
    throw error;
  }
};

// API methods
export const api = {
  // Auth
  login: async (username: string, password: string) => {
    try {
      const response = await apiRequest("/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        let errorMessage = "فشل تسجيل الدخول";
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (data.token) {
        setToken(data.token);
      }
      return data;
    } catch (error: any) {
      // Handle network errors
      if (
        error.message === "Failed to fetch" ||
        error.message.includes("fetch")
      ) {
        throw new Error(
          "لا يمكن الاتصال بالخادم. تأكد من أن الخادم يعمل على https://noteapp.foursw.com/api"
        );
      }
      throw error;
    }
  },

  register: async (username: string, password: string) => {
    const response = await apiRequest("/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    const data = await response.json();
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  getUser: async () => {
    const response = await apiRequest("/user", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    return response.json();
  },

  logout: async () => {
    const response = await apiRequest("/logout", {
      method: "POST",
    });

    if (response.ok) {
      removeToken();
    }
    return response.json();
  },

  // Notes
  getNotes: async () => {
    const response = await apiRequest("/notes", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch notes");
    }

    const notes = await response.json();
    // Convert numeric IDs to strings to match frontend types
    return notes.map((note: any) => ({
      ...note,
      id: note.id.toString(),
    }));
  },

  createNote: async (note: {
    title: string;
    blocks: any[][];
    content?: string;
    date?: string;
  }) => {
    const response = await apiRequest("/notes", {
      method: "POST",
      body: JSON.stringify(note),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create note");
    }

    const createdNote = await response.json();
    // Convert numeric ID to string
    return {
      ...createdNote,
      id: createdNote.id.toString(),
    };
  },

  updateNote: async (
    id: string,
    note: {
      title?: string;
      blocks?: any[][];
      content?: string;
      comments?: Record<string, any>;
    }
  ) => {
    const response = await apiRequest(`/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(note),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update note");
    }

    const updatedNote = await response.json();
    // Convert numeric ID to string
    return {
      ...updatedNote,
      id: updatedNote.id.toString(),
    };
  },

  deleteNote: async (id: string) => {
    const response = await apiRequest(`/notes/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete note");
    }

    return response.json();
  },

  // Profile
  updateProfile: async (data: { username?: string; password?: string }) => {
    const response = await apiRequest("/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update profile");
    }

    return response.json();
  },

  // Admin
  adminLogin: async (username: string, password: string) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Admin login failed");
      }

      const data = await response.json();
      if (data.token) {
        setToken(data.token);
      }
      return data;
    } catch (error: any) {
      if (
        error.message === "Failed to fetch" ||
        error.message.includes("fetch")
      ) {
        throw new Error(
          "لا يمكن الاتصال بالخادم. تأكد من أن الخادم يعمل على https://noteapp.foursw.com/api"
        );
      }
      throw error;
    }
  },

  getAdminUsers: async () => {
    const response = await apiRequest("/admin/users", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const users = await response.json();
    // Convert numeric IDs to strings
    return users.map((user: any) => ({
      ...user,
      id: user.id.toString(),
    }));
  },

  createUser: async (username: string, password: string) => {
    const response = await apiRequest("/admin/users", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create user");
    }

    const data = await response.json();
    // Convert numeric ID to string
    return {
      ...data.user,
      id: data.user.id.toString(),
    };
  },

  updateUserPassword: async (userId: string, password: string) => {
    const response = await apiRequest(`/admin/users/${userId}/password`, {
      method: "PUT",
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update user password");
    }

    return response.json();
  },

  deleteUser: async (userId: string) => {
    const response = await apiRequest(`/admin/users/${userId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete user");
    }

    return response.json();
  },

  // Share Notes
  createShareLink: async (noteId: string) => {
    const response = await apiRequest(`/notes/${noteId}/share`, {
      method: "POST",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create share link");
    }

    return response.json();
  },

  getSharedNote: async (token: string) => {
    const response = await fetch(`${BASE_URL}/shared/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "الملاحظة غير موجودة أو انتهت صلاحية الرابط");
    }

    return response.json();
  },

  importSharedNote: async (token: string) => {
    const response = await apiRequest(`/shared/${token}/import`, {
      method: "POST",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to import note");
    }

    const data = await response.json();
    return {
      ...data,
      note: {
        ...data.note,
        id: data.note.id.toString(),
      },
    };
  },

  deleteShareLink: async (noteId: string) => {
    const response = await apiRequest(`/notes/${noteId}/share`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete share link");
    }

    return response.json();
  },
};
