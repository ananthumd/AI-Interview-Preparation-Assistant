import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import InputArea from "./components/InputArea";
import TopBar from "./components/TopBar";
import { useInterview } from "./hooks/useInterview";
import "./styles/app.css";

export default function App() {
  const interview = useInterview();

  return (
    <div className="app-layout">
      <Sidebar interview={interview} />
      <div className="main-panel">
        <TopBar interview={interview} />
        <ChatArea interview={interview} />
        <InputArea interview={interview} />
      </div>
    </div>
  );
}
