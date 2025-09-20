import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  // If the response is successful (status 2xx), just return the response
  (response) => {
    return response;
  },
  // If there's an error in the response
  (error) => {
    // You can handle errors globally here. For example:
    // - Log the error
    // - Show a toast notification
    // - Redirect to a login page on 401 Unauthorized errors
    console.error("API Error:", error.response?.data?.message || error.message);

    // IMPORTANT: Reject the promise to let the calling function's .catch() handle it
    return Promise.reject(error);
  }
);

// This object groups all API functions related to notes
export const notesAPI = {
  /**
   * Fetches all notes from the server.
   * @returns {Promise<Array>} A promise that resolves to an array of notes.
   */
  getNotes: () => {
    return apiClient.get("/notes");
  },

  /**
   * Fetches a single note by its ID.
   * @param {string} id The ID of the note.
   * @returns {Promise<Object>} A promise that resolves to the note object.
   */
  getNoteById: (id) => {
    return apiClient.get(`/notes/${id}`);
  },

  /**
   * Creates a new note.
   * @param {Object} noteData The data for the new note (e.g., { title, content }).
   * @returns {Promise<Object>} A promise that resolves to the newly created note.
   */
  createNote: (noteData) => {
    return apiClient.post("/notes", noteData);
  },

  /**
   * Updates an existing note.
   * @param {string} id The ID of the note to update.
   * @param {Object} noteData The updated data for the note.
   * @returns {Promise<Object>} A promise that resolves to the updated note.
   */
  updateNote: (id, noteData) => {
    return apiClient.put(`/notes/${id}`, noteData);
  },

  /**
   * Deletes a note by its ID.
   * @param {string} id The ID of the note to delete.
   * @returns {Promise<Object>} A promise that resolves to a success message.
   */
  deleteNote: (id) => {
    return apiClient.delete(`/notes/${id}`);
  },

  /**
   * Triggers the AI summarization for a specific note.
   * @param {string} id The ID of the note to summarize.
   * @returns {Promise<Object>} A promise that resolves to the note with its new summary.
   */
  summarizeNote: (id) => {
    return apiClient.post(`/notes/${id}/summarize`);
  },
};

export default apiClient;
