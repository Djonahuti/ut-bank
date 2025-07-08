import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: {
    id: 'user-id-123',
    full_name: 'David Jonah',
    balance: 150000,
  },
  isAuthenticated: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload
      state.isAuthenticated = true
    },
    logout(state) {
      state.user = { id: '', full_name: '', balance: 0 }
      state.isAuthenticated = false
    },
  }
})

export const { login, logout } = userSlice.actions
export default userSlice.reducer
