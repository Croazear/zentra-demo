import React, { useState, useEffect } from "react";
import { Sun, Moon, Bell, MessageSquare } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import DocumentList from "./components/DocumentList";
import StartCompany from "./components/StartCompany";
import AIAssistantView from "./components/AIAssistantView";
import CalendarView from "./components/CalendarView";
import ChatPanel from "./components/ChatPanel";
import FinancesView from "./components/FinancesView";
import { ViewType } from "./types";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleNavigateToDocument = (docId: string) => {
    setSelectedDocId(docId);
    setCurrentView("documents");
  };

  const handleNavigateToCalendar = (day: number) => {
    setSelectedCalendarDay(day);
    setCurrentView("calendar");
  };

  const setView = (view: ViewType) => {
    if (view !== "documents") setSelectedDocId(null);
    if (view !== "calendar") setSelectedCalendarDay(null);
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <Dashboard
            onNavigateToDocument={handleNavigateToDocument}
            onNavigateToFinances={() => setView("finances")}
            onNavigateToCalendar={handleNavigateToCalendar}
          />
        );
      case "documents":
        return <DocumentList initialSelectedId={selectedDocId} />;
      case "calendar":
        return <CalendarView initialDay={selectedCalendarDay} />;
      case "ai-assistant":
        return <AIAssistantView />;
      case "start-company":
        return <StartCompany />;
      case "finances":
        return <FinancesView />;
      case "settings":
        return (
          <div className="flex items-center justify-center h-[60vh] text-slate-400">
            <p>Ustawienia konta (Mockup)</p>
          </div>
        );
      default:
        return (
          <Dashboard
            onNavigateToDocument={handleNavigateToDocument}
            onNavigateToFinances={() => setView("finances")}
            onNavigateToCalendar={handleNavigateToCalendar}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar currentView={currentView} setView={setView} />

      <main className="flex-1 ml-64 p-8 pb-20">
        <header className="flex items-center justify-between mb-10">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            {currentView.replace("-", " ")}
          </h2>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 relative">
              <Bell size={20} />
              <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            </button>
          </div>
        </header>

        {renderView()}

        {currentView !== "ai-assistant" && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-8 right-8 bg-slate-950 text-white dark:bg-white dark:text-slate-950 p-4 rounded-[28px]"
          >
            <MessageSquare size={24} />
          </button>
        )}

        <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </main>
    </div>
  );
};

export default App;
