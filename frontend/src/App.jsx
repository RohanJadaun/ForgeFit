import { Component } from "react";
import AppRoutes from "./routes/AppRoutes";

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("ForgeFit UI error:", error);
  }

  render() {
    if (this.state.hasError) {
      return <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6"><section className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg"><h1 className="text-2xl font-bold text-slate-900">This page hit a problem</h1><p className="mt-2 text-sm text-slate-600">Your account and saved records are still safe. Reload the page to continue.</p><button type="button" onClick={() => window.location.reload()} className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">Reload ForgeFit</button></section></main>;
    }
    return this.props.children;
  }
}

function App() {
  return <AppErrorBoundary><AppRoutes /></AppErrorBoundary>;
}

export default App;
