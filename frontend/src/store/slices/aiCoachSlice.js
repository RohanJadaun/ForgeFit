import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getReadinessScore,
  getRecoveryInsight,
  getWeeklyPlan,
  getCoachChat,
  deleteCoachChat,
  askCoach,
} from "../../services/aiCoachService";

export const fetchReadiness = createAsyncThunk(
  "ai/fetchReadiness",
  async (_, { rejectWithValue }) => {
    try { return await getReadinessScore(); }
    catch (error) { return rejectWithValue(error.response?.data?.message || "Could not load readiness."); }
  }
);

export const fetchRecovery = createAsyncThunk(
  "ai/fetchRecovery",
  async (_, { rejectWithValue }) => {
    try { return await getRecoveryInsight(); }
    catch (error) { return rejectWithValue(error.response?.data?.message || "Could not load recovery insight."); }
  }
);

export const fetchWeeklyPlan = createAsyncThunk(
  "ai/fetchWeeklyPlan",
  async (_, { rejectWithValue }) => {
    try { return await getWeeklyPlan(); }
    catch (error) { return rejectWithValue(error.response?.data?.message || "Could not load your weekly plan."); }
  }
);

export const fetchChat = createAsyncThunk(
  "ai/fetchChat",
  async (_, { rejectWithValue }) => {
    try { return await getCoachChat(); }
    catch (error) { return rejectWithValue(error.response?.data?.message || "Could not load your coach chat history."); }
  }
);

export const clearChat = createAsyncThunk(
  "ai/clearChat",
  async (_, { rejectWithValue }) => {
    try { await deleteCoachChat(); return true; }
    catch (error) { return rejectWithValue(error.response?.data?.message || "Could not clear your coach chat."); }
  }
);

export const sendMessage = createAsyncThunk(
  "ai/sendMessage",
  async ({ message }, { rejectWithValue, getState }) => {
    try {
      const response = await askCoach(message);
      if (typeof response.reply === "string" && response.reply.trim()) return { message, ...response };
      throw new Error("Coach returned an empty reply.");
    }
    catch (error) {
      if (!error.response || error.response.status === 404 || error.response.status >= 500) {
        const goal = getState().auth.user?.fitnessProfile?.goal || "your fitness goal";
        const text = message.toLowerCase();
        const reply = /pain|injur|dizz|chest/i.test(text)
          ? "Stop exercising if you have sharp pain, dizziness, or chest symptoms. Please consult a qualified clinician for symptoms or injuries."
          : /recover|rest|tired|sore/i.test(text)
            ? "Take an easy day if you feel unusually tired or sore. Gentle walking, hydration, and sleep can support recovery."
            : /food|meal|protein|nutrition|calorie/i.test(text)
              ? "Build meals around a protein source, vegetables or fruit, and enough water. Log a day of eating in ForgeFit for more tailored guidance."
              : /workout|train|plan|muscle|strength|fat loss/i.test(text)
                ? `For ${goal}, start with three manageable sessions this week, leave recovery time between hard sessions, and increase effort gradually while keeping good form.`
                : "I can help with training, recovery, and nutrition. Tell me your goal and what you would like help planning.";
        return { message, reply, provider: "offline", notice: "The API could not be reached. This is a short offline fallback reply." };
      }
      return rejectWithValue(error.response?.data?.message || "Could not reach your coach. Try again.");
    }
  }
);

const initialState = {
  readiness: null,
  recovery: null,
  weeklyPlan: null,
  chat: [],
  loading: false,
  loadingCount: 0,
  sending: false,
  chatLoading: false,
  clearingChat: false,
  notice: null,
  provider: null,
  error: null,
};

const aiCoachSlice = createSlice({
  name: "aiCoach",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReadiness.pending, (state) => { state.loadingCount += 1; state.loading = true; state.error = null; })
      // READINESS
      .addCase(fetchReadiness.fulfilled, (state, action) => {
        state.loadingCount = Math.max(0, state.loadingCount - 1);
        state.loading = state.loadingCount > 0;
        state.readiness = action.payload.readiness;
      })
      .addCase(fetchReadiness.rejected, (state, action) => { state.loadingCount = Math.max(0, state.loadingCount - 1); state.loading = state.loadingCount > 0; state.error = action.payload; })

      // RECOVERY
      .addCase(fetchRecovery.pending, (state) => { state.loadingCount += 1; state.loading = true; state.error = null; })
      .addCase(fetchRecovery.fulfilled, (state, action) => {
        state.loadingCount = Math.max(0, state.loadingCount - 1);
        state.loading = state.loadingCount > 0;
        state.recovery = action.payload.recovery;
      })
      .addCase(fetchRecovery.rejected, (state, action) => { state.loadingCount = Math.max(0, state.loadingCount - 1); state.loading = state.loadingCount > 0; state.error = action.payload; })

      // WEEKLY PLAN
      .addCase(fetchWeeklyPlan.pending, (state) => { state.loadingCount += 1; state.loading = true; state.error = null; })
      .addCase(fetchWeeklyPlan.fulfilled, (state, action) => {
        state.loadingCount = Math.max(0, state.loadingCount - 1);
        state.loading = state.loadingCount > 0;
        state.weeklyPlan = action.payload.weeklyPlan;
      })
      .addCase(fetchWeeklyPlan.rejected, (state, action) => { state.loadingCount = Math.max(0, state.loadingCount - 1); state.loading = state.loadingCount > 0; state.error = action.payload; })

      .addCase(fetchChat.pending, (state) => { state.chatLoading = true; })
      .addCase(fetchChat.fulfilled, (state, action) => { state.chatLoading = false; state.chat = action.payload.messages || []; })
      .addCase(fetchChat.rejected, (state, action) => { state.chatLoading = false; state.error = action.payload; })

      .addCase(clearChat.pending, (state) => { state.clearingChat = true; state.error = null; })
      .addCase(clearChat.fulfilled, (state) => { state.clearingChat = false; state.chat = []; state.error = null; state.notice = null; state.provider = null; })
      .addCase(clearChat.rejected, (state, action) => { state.clearingChat = false; state.error = action.payload; })

      // CHAT
      .addCase(sendMessage.pending, (state, action) => {
        state.sending = true;
        state.error = null;
        state.notice = null;
        state.chat.push({ type: "user", text: action.meta.arg.message });
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        state.chat.push({ type: "ai", text: action.payload.reply });
        state.provider = action.payload.provider;
        state.notice = action.payload.notice || null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload;
        if (state.chat.at(-1)?.type === "user") state.chat.pop();
      });
    },
});

export default aiCoachSlice.reducer;
