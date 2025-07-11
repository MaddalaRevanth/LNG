const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [], // ✅ should be an array
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});
