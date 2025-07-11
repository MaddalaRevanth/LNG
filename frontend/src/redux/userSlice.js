const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    otherUsers: [], // ✅ should be an array
    selectedUser: null,
    socket: null,
    onlineUsers: [], // ✅ should be an array
    searchData: [], // ✅ should be an array
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setSearchData: (state, action) => {
      state.searchData = action.payload;
    },
  },
});
