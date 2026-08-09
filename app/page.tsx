'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown'; 

const THEMES = [
  {
    id: "cyan",
    name: "🌌 Cyberpunk",
    bgUrl: "https://wallpaperaccess.com/full/2454628.png",
    primaryGradient: "from-blue-500 to-cyan-500",
    textGradient: "from-blue-400 to-cyan-300",
    textAccent: "text-cyan-400",
    bgAccent: "bg-cyan-600",
    borderAccent: "border-cyan-400",
    bgBadge: "bg-cyan-500/20",
    borderBadge: "border-cyan-500/30",
    borderFocus: "focus:border-cyan-500",
    shadowGlow: "shadow-[0_0_15px_rgba(6,182,212,0.5)]",
    activeMenu: "from-blue-500/80 to-cyan-500/80",
    accentClass: "accent-cyan-500",
    hoverAns: "hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-cyan-100",
    selectedAns: "bg-gradient-to-r from-blue-600 to-cyan-600 border-cyan-300 text-white"
  },
  {
    id: "rose",
    name: "🌅 Hoàng Hôn",
    bgUrl: "https://images.unsplash.com/photo-1506259091721-347e791bab0f?q=80&w=2070",
    primaryGradient: "from-orange-500 to-rose-500",
    textGradient: "from-orange-400 to-rose-300",
    textAccent: "text-rose-400",
    bgAccent: "bg-rose-600",
    borderAccent: "border-rose-400",
    bgBadge: "bg-rose-500/20",
    borderBadge: "border-rose-500/30",
    borderFocus: "focus:border-rose-500",
    shadowGlow: "shadow-[0_0_15px_rgba(244,63,94,0.5)]",
    activeMenu: "from-orange-500/80 to-rose-500/80",
    accentClass: "accent-rose-500",
    hoverAns: "hover:bg-rose-500/20 hover:border-rose-400 hover:text-rose-100",
    selectedAns: "bg-gradient-to-r from-orange-600 to-rose-600 border-rose-300 text-white"
  },
  {
    id: "emerald",
    name: "🌿 Rừng Thần Bí",
    bgUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2000",
    primaryGradient: "from-teal-500 to-emerald-500",
    textGradient: "from-teal-400 to-emerald-300",
    textAccent: "text-emerald-400",
    bgAccent: "bg-emerald-600",
    borderAccent: "border-emerald-400",
    bgBadge: "bg-emerald-500/20",
    borderBadge: "border-emerald-500/30",
    borderFocus: "focus:border-emerald-500",
    shadowGlow: "shadow-[0_0_15px_rgba(16,185,129,0.5)]",
    activeMenu: "from-teal-500/80 to-emerald-500/80",
    accentClass: "accent-emerald-500",
    hoverAns: "hover:bg-emerald-500/20 hover:border-emerald-400 hover:text-emerald-100",
    selectedAns: "bg-gradient-to-r from-teal-600 to-emerald-600 border-emerald-300 text-white"
  },
  {
    id: "purple",
    name: "🔮 Dải Ngân Hà",
    bgUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000",
    primaryGradient: "from-fuchsia-500 to-purple-500",
    textGradient: "from-fuchsia-400 to-purple-300",
    textAccent: "text-purple-400",
    bgAccent: "bg-purple-600",
    borderAccent: "border-purple-400",
    bgBadge: "bg-purple-500/20",
    borderBadge: "border-purple-500/30",
    borderFocus: "focus:border-purple-500",
    shadowGlow: "shadow-[0_0_15px_rgba(168,85,247,0.5)]",
    activeMenu: "from-fuchsia-500/80 to-purple-500/80",
    accentClass: "accent-purple-500",
    hoverAns: "hover:bg-purple-500/20 hover:border-purple-400 hover:text-purple-100",
    selectedAns: "bg-gradient-to-r from-fuchsia-600 to-purple-600 border-purple-300 text-white"
  }
];

export default function HieuHubMaster() {
  const [currentTheme, setCurrentTheme] = useState<any>(THEMES[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [activeTab, setActiveTab] = useState("💎 Flashcard"); 
  const [dbMode, setDbMode] = useState("Mẫu của Hieu");
  const [isDbDropdownOpen, setIsDbDropdownOpen] = useState(false);
  const [customSheetUrl, setCustomSheetUrl] = useState("");
  const defaultUrl = "https://docs.google.com/spreadsheets/d/1Cryecd2kF8cmpXGfhsKFenMT89XHhyaMJyx7wkeUxa4/edit#gid=1604492918";
  const currentSheetUrl = dbMode === "Mẫu của Hieu" ? defaultUrl : customSheetUrl;

  const [allData, setAllData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [alphaFilter, setAlphaFilter] = useState("ALL");
  const ALPHABETS = ['ALL', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const QUIZ_MODES = ["Dạng 1 (Trắc nghiệm)", "Dạng 2 (Làm đâu biết đó)", "Dạng 3 (Viết từ)", "Dạng 4 (Loại từ)", "Dạng 5 (Giới từ)", "Dạng 6 (Chọn từ)", "Dạng 7 (Đồng nghĩa)", "Dạng 8 (Trái nghĩa)"];
  const [quizMode, setQuizMode] = useState("Dạng 1 (Trắc nghiệm)");
  const [isQuizDropdownOpen, setIsQuizDropdownOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<any>(null);
  const [userTyped, setUserTyped] = useState('');
  const [numQuestions, setNumQuestions] = useState<number | string>(10);
  const [dang1Answers, setDang1Answers] = useState<any>({});
  const [dang1Submitted, setDang1Submitted] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<any[]>([]);

  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");

  // Trạng thái bật/tắt Sidebar trên mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const MENUS = ["⚙️ Dashboard Quản lý", "💎 Flashcard", "📝 Kiểm tra", "📊 Lịch sử Câu sai", "🤖 Trợ lý AI"];

  useEffect(() => {
    const savedUser = localStorage.getItem("hieu_hub_user");
    if (savedUser) {
      setUsername(savedUser);
      setIsLoggedIn(true);
    }
    const savedThemeId = localStorage.getItem("hieu_hub_theme");
    if (savedThemeId) {
      const foundTheme = THEMES.find(t => t.id === savedThemeId);
      if (foundTheme) setCurrentTheme(foundTheme);
    }
  }, []);

  const changeTheme = (theme: any) => {
    setCurrentTheme(theme);
    localStorage.setItem("hieu_hub_theme", theme.id);
  };

  const handleLogin = (e: any) => {
    e.preventDefault();
    const secretPassword = process.env.NEXT_PUBLIC_APP_PASSWORD;
    if (username.trim() !== "" && password === secretPassword) {
      localStorage.setItem("hieu_hub_user", username);
      setIsLoggedIn(true);
    } else {
      alert("❌ Tên đăng nhập không được để trống hoặc sai mật khẩu!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("hieu_hub_user");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  const loadAllData = async () => {
    try {
      const res = await axios.post('https://hieu-hub-backend.onrender.com/api/get-data', { sheet_url: currentSheetUrl });
      if (res.data.success) setAllData(res.data.data);
    } catch (e) { console.error("Lỗi:", e); }
  };

  useEffect(() => { if(isLoggedIn) loadAllData(); }, [dbMode, customSheetUrl, isLoggedIn]);

  const loadQuiz = async () => {
    setQuizFeedback(null); setQuizIdx(0); setQuizQuestions([]); setDang1Answers({}); setDang1Submitted(false);
    try {
      const res = await axios.post('https://hieu-hub-backend.onrender.com/api/generate-quiz', { 
        sheet_url: currentSheetUrl, mode: quizMode,
        num: quizMode === "Dạng 1 (Trắc nghiệm)" ? Number(numQuestions) : 10
      });
      if (res.data.success) setQuizQuestions(res.data.data);
    } catch (e) {}
  };

  useEffect(() => { 
    setQuizQuestions([]); 
    if(activeTab === "📝 Kiểm tra" && isLoggedIn) loadQuiz(); 
  }, [quizMode, activeTab, isLoggedIn]);

  const checkQuizAnswer = (answer: any) => {
    if (quizFeedback) return;
    const currentQ = quizQuestions[quizIdx];
    const isCorrect = answer.toString().trim().toLowerCase() === currentQ.answer.toString().trim().toLowerCase();
    
    setQuizFeedback({ isCorrect, msg: isCorrect ? "🎉 Xuất sắc!" : `❌ Sai rồi! Đáp án là: ${currentQ.answer}`, clickedOpt: answer });

    if (!isCorrect) {
      setWrongAnswers(prev => [...prev, {
        question: currentQ.title,
        info: currentQ.subtitle,
        userAnswer: answer || "Bỏ qua",
        correctAnswer: currentQ.answer,
        mode: quizMode
      }]);
    }
  };

  const handleDang1Select = (qIndex: number, option: string) => {
    if (dang1Submitted) return;
    setDang1Answers((prev: any) => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmitDang1 = () => {
    setDang1Submitted(true);
    const newMistakes: any[] = [];
    quizQuestions.forEach((q: any, i: number) => {
      const uAns = dang1Answers[i];
      if (uAns !== q.answer) {
        newMistakes.push({ question: q.title, info: q.subtitle, userAnswer: uAns || "Chưa chọn", correctAnswer: q.answer, mode: "Dạng 1 (Trắc nghiệm)" });
      }
    });
    if (newMistakes.length > 0) setWrongAnswers(prev => [...prev, ...newMistakes]);
  };

  const calculateDang1Score = () => {
    let score = 0;
    quizQuestions.forEach((q: any, i: number) => { if (dang1Answers[i] === q.answer) score += 1; });
    return score;
  };

  const sendAiMessage = async () => {
    if(!chatInput.trim()) return;
    const userMsg = { role: "user", content: chatInput };
    setChatMessages((prev: any) => [...prev, userMsg]);
    setChatInput("");
    try {
      const res = await axios.post('https://hieu-hub-backend.onrender.com/api/ask-ai', { prompt: userMsg.content });
      setChatMessages((prev: any) => [...prev, { role: "ai", content: res.data.reply }]);
    } catch(e) {}
  };

  const filteredDashboardData = allData.filter((item: any) => {
    const word = (item['Từ'] || '').toLowerCase();
    const meaning = (item['Nghĩa'] || '').toLowerCase();
    const searchLow = searchTerm.toLowerCase();
    return (word.includes(searchLow) || meaning.includes(searchLow)) && (alphaFilter === 'ALL' || (item['Từ'] || '').toUpperCase().startsWith(alphaFilter));
  });

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#050505] font-sans bg-cover bg-fixed relative overflow-hidden px-4" style={{ backgroundImage: `url('${currentTheme.bgUrl}')`, transition: 'background-image 0.5s ease' }}>
        <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-md z-0"></div>
        
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 bg-white/5 backdrop-blur-2xl p-6 sm:p-10 rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] w-full max-w-md">
          <div className="text-center mb-6 relative z-20">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br ${currentTheme.primaryGradient} rounded-3xl flex items-center justify-center ${currentTheme.shadowGlow} mb-3 border border-white/20`}>
              <span className="text-3xl sm:text-4xl">🚀</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white ${currentTheme.textGradient} tracking-tight`}>Hieu&apos;s Hub</h1>
            <p className="text-gray-400 mt-1 text-xs sm:text-sm font-medium">Hệ thống ôn luyện TOEIC & AI Tutor</p>
          </div>

          <form onSubmit={handleLogin} className="relative z-20 flex flex-col gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 pl-1">Tên của bạn</label>
              <input type="text" value={username} onChange={(e: any) => setUsername(e.target.value)} required placeholder="VD: Hieu Dang..." className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm sm:text-base text-white outline-none ${currentTheme.borderFocus} focus:bg-black/60 transition-colors shadow-inner`} />
            </div>
            
            <div className="mb-2">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 pl-1">Mật khẩu</label>
              <input type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} required placeholder="Nhập mật khẩu..." className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm sm:text-base text-white outline-none ${currentTheme.borderFocus} focus:bg-black/60 transition-colors shadow-inner`} />
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className={`w-full py-3.5 bg-gradient-to-r ${currentTheme.primaryGradient} text-white font-bold rounded-xl ${currentTheme.shadowGlow} tracking-widest uppercase text-xs sm:text-sm mt-1`}>
              Đăng nhập ngay
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans bg-cover bg-fixed relative overflow-hidden text-sm sm:text-base" style={{ backgroundImage: `url('${currentTheme.bgUrl}')` }}>
      <div className="absolute inset-0 bg-gray-950/85 backdrop-blur-[8px] z-0"></div>

      {/* --- NÚT MỞ/ĐÓNG MENU CHO MOBILE --- */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        className="md:hidden fixed top-4 left-4 z-50 bg-black/60 backdrop-blur-md border border-white/15 p-2.5 rounded-xl text-white shadow-lg active:scale-95 transition-transform"
      >
        <span className="text-lg font-bold">{isSidebarOpen ? '✕' : '☰'}</span>
      </button>

      {/* --- SIDEBAR --- */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-40
        w-72 sm:w-64 m-0 md:m-3 sm:rounded-[1.5rem] 
        bg-[#0b0f19]/95 md:bg-white/5 backdrop-blur-2xl border-r md:border border-white/10 
        flex flex-col p-4 sm:p-5 shadow-2xl transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        overflow-y-auto
      `}>
        
        <div className="text-center mb-4 sm:mb-6 relative z-10 border-b border-white/10 pb-4 sm:pb-6 pt-10 md:pt-0">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-gradient-to-br ${currentTheme.primaryGradient} rounded-full flex items-center justify-center ${currentTheme.shadowGlow} mb-2 border border-white/20`}>
            <span className="text-base sm:text-xl font-black">{username[0]?.toUpperCase()}</span>
          </div>
          <h2 className="text-[11px] font-bold text-gray-400">Xin chào,</h2>
          <h1 className={`text-sm sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r ${currentTheme.textGradient} truncate px-2`}>{username}</h1>
        </div>

        <div className="flex flex-col gap-1.5 flex-1 relative z-10">
          <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.1em] mb-1 pl-2">Menu</h3>
          {MENUS.map((m: any) => (
            <button 
              key={m} 
              onClick={() => { setActiveTab(m); setIsSidebarOpen(false); }}
              className={`text-left px-3.5 py-2.5 rounded-xl transition-all duration-200 text-xs sm:text-sm font-medium ${activeTab === m ? `bg-gradient-to-r ${currentTheme.activeMenu} text-white shadow-lg border border-white/20` : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'} flex justify-between items-center`}
            >
              {m}
              {m === "📊 Lịch sử Câu sai" && wrongAnswers.length > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{wrongAnswers.length}</span>
              )}
            </button>
          ))}
        </div>
        
        <div className="mt-3 relative z-20 bg-black/40 p-3 rounded-xl border border-white/5 mb-2">
          <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.1em] mb-2 flex items-center gap-1.5">
            <span>🎨</span> Đổi Chủ Đề
          </h3>
          <div className="flex justify-between gap-1.5">
            {THEMES.map((t: any) => (
              <button
                key={t.id}
                onClick={() => changeTheme(t)}
                title={t.name}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-all duration-300 ${currentTheme.id === t.id ? `border-white scale-110 shadow-lg` : 'border-transparent opacity-50 hover:opacity-100'} bg-gradient-to-br ${t.primaryGradient}`}
              />
            ))}
          </div>
        </div>

        <div className="relative z-20 bg-black/40 p-3 rounded-xl border border-white/5 mb-2">
          <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.1em] mb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Database
          </h3>
          <div className="relative mb-2">
            <button onClick={() => setIsDbDropdownOpen(!isDbDropdownOpen)} className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white flex justify-between items-center">
              {dbMode}
              <span className="text-gray-400 text-[9px]">▼</span>
            </button>
            <AnimatePresence>
              {isDbDropdownOpen && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute bottom-full w-full mb-1 bg-[#0f172a] border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50">
                  {["Mẫu của Hieu", "Sheets cá nhân"].map((m: any) => (
                    <button key={m} onClick={() => { setDbMode(m); setIsDbDropdownOpen(false); }} className={`w-full text-left px-3 py-2 text-xs transition-colors ${dbMode === m ? `${currentTheme.bgBadge} ${currentTheme.textAccent}` : 'text-gray-300 hover:bg-white/5'}`}>
                      {m}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {dbMode === "Sheets cá nhân" && (
            <div className="mb-2">
              <input type="text" placeholder="Dán link Google Sheets..." value={customSheetUrl} onChange={(e: any) => setCustomSheetUrl(e.target.value)} className={`w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none ${currentTheme.borderFocus}`} />
            </div>
          )}
          <button onClick={loadAllData} className="w-full text-[11px] font-bold bg-white/10 hover:bg-white/20 py-1.5 rounded-lg transition-colors text-gray-300">Đồng bộ ({allData.length})</button>
        </div>

        <button onClick={handleLogout} className="relative z-25 w-full text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2.5 rounded-xl transition-colors border border-red-500/20 flex items-center justify-center gap-1.5">
          <span>🚪</span> Đăng xuất
        </button>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 relative scroll-smooth z-10 pt-16 md:pt-6">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.2 }} className="max-w-5xl mx-auto relative pb-10">
            
            {activeTab === "⚙️ Dashboard Quản lý" && (
              <div>
                <h2 className={`text-2xl sm:text-3xl font-black mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r ${currentTheme.textGradient}`}>Kho Từ Vựng</h2>
                <div className="bg-white/5 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-white/10 mb-5 shadow-xl flex flex-col md:flex-row gap-3 items-center">
                  <input type="text" placeholder="🔍 Tìm kiếm từ vựng..." value={searchTerm} onChange={(e: any) => setSearchTerm(e.target.value)} className={`flex-1 bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm sm:text-base text-white outline-none ${currentTheme.borderFocus} w-full`} />
                  <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 overflow-x-auto w-full md:w-auto">
                    {ALPHABETS.slice(0, 10).map((letter: any) => <button key={letter} onClick={() => setAlphaFilter(letter)} className={`min-w-[28px] h-7 rounded-lg font-bold transition-all text-xs ${alphaFilter === letter ? `${currentTheme.bgAccent} text-white shadow-lg` : 'text-gray-400 hover:bg-white/15'}`}>{letter}</button>)}
                    <span className="text-gray-600 self-center px-1 text-xs">...</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDashboardData.length > 0 ? filteredDashboardData.map((item: any, i: number) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: (i % 15) * 0.01 }} className="bg-white/5 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-lg text-white">{item['Từ']}</p>
                        <span className={`${currentTheme.bgBadge} ${currentTheme.textAccent} text-[10px] font-bold px-2 py-0.5 rounded-md border ${currentTheme.borderBadge}`}>{item['Loại'] || 'Word'}</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-2 font-mono">/{item['Phát âm']}/</p>
                      <p className="text-gray-200 text-sm sm:text-base">{item['Nghĩa']}</p>
                      {item['Giới từ'] && <p className={`${currentTheme.textAccent} text-xs mt-2.5 font-bold bg-white/5 inline-block px-2 py-0.5 rounded-md border border-white/5`}>+ {item['Giới từ']}</p>}
                    </motion.div>
                  )) : <p className="text-gray-500 col-span-3 text-center text-sm mt-6">Kho từ vựng trống.</p>}
                </div>
              </div>
            )}

            {activeTab === "💎 Flashcard" && allData.length > 0 && (
              <div className="flex flex-col items-center pt-2">
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-px w-12 bg-gradient-to-r from-transparent to-gray-500"></span>
                  <p className="text-gray-400 tracking-[0.2em] font-bold text-xs">THẺ {flashcardIdx + 1} / {allData.length}</p>
                  <span className="h-px w-12 bg-gradient-to-l from-transparent to-gray-500"></span>
                </div>

                <div className="w-full max-w-lg h-[300px] sm:h-[340px] cursor-pointer mb-6" onClick={() => setIsFlipped(!isFlipped)} style={{ perspective: '1200px' }}>
                  <motion.div className="w-full h-full relative" style={{ transformStyle: 'preserve-3d' }} animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.4, type: "spring", stiffness: 90, damping: 15 }}>
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 shadow-xl flex flex-col justify-center items-center p-6 overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                      <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${currentTheme.primaryGradient}`}></div>
                      <span className={`absolute top-4 left-5 ${currentTheme.textAccent} opacity-50 text-[10px] font-bold tracking-[0.2em]`}>FRONT</span>
                      <h1 className="text-4xl sm:text-5xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 text-center">{allData[flashcardIdx]['Từ']}</h1>
                      <div className="flex items-center gap-2">
                        <span className={`${currentTheme.textAccent} text-xl font-mono italic opacity-80`}>/{allData[flashcardIdx]['Phát âm']}/</span>
                        {allData[flashcardIdx]['Loại'] && <span className="bg-white/10 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/20">{allData[flashcardIdx]['Loại']}</span>}
                      </div>
                      <p className="absolute bottom-4 text-gray-500 text-[10px] tracking-widest">CHẠM ĐỂ LẬT THẺ</p>
                    </div>

                    <div className={`absolute inset-0 bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-[1.5rem] sm:rounded-[2rem] border ${currentTheme.borderBadge} shadow-xl flex flex-col justify-center items-center p-6 overflow-hidden`} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                      <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${currentTheme.primaryGradient}`}></div>
                      <span className={`absolute top-4 left-5 ${currentTheme.textAccent} opacity-50 text-[10px] font-bold tracking-[0.2em]`}>BACK</span>
                      <h1 className="text-2xl sm:text-4xl font-black text-white mb-4 text-center leading-snug">{allData[flashcardIdx]['Nghĩa']}</h1>
                      <div className="flex flex-wrap justify-center gap-2 w-full">
                        {allData[flashcardIdx]['Giới từ'] && <span className="bg-blue-500/20 text-blue-300 px-2.5 py-1 text-xs rounded-lg font-semibold">+ {allData[flashcardIdx]['Giới từ']}</span>}
                        {allData[flashcardIdx]['Đồng nghĩa'] && <span className="bg-green-500/20 text-green-400 px-2.5 py-1 text-xs rounded-lg font-semibold">= {allData[flashcardIdx]['Đồng nghĩa']}</span>}
                        {allData[flashcardIdx]['Trái nghĩa'] && <span className="bg-red-500/20 text-red-400 px-2.5 py-1 text-xs rounded-lg font-semibold">≠ {allData[flashcardIdx]['Trái nghĩa']}</span>}
                      </div>
                    </div>

                  </motion.div>
                </div>
                
                <div className="flex gap-2.5 w-full max-w-md">
                  <button onClick={() => { setFlashcardIdx(p => Math.max(0, p - 1)); setIsFlipped(false); }} className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-bold text-xs sm:text-sm">Lùi</button>
                  <button onClick={() => setIsFlipped(!isFlipped)} className={`flex-[2] py-3 bg-gradient-to-r ${currentTheme.primaryGradient} text-white rounded-xl font-bold text-sm ${currentTheme.shadowGlow}`}>LẬT THẺ</button>
                  <button onClick={() => { setFlashcardIdx(p => Math.min(allData.length - 1, p + 1)); setIsFlipped(false); }} className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-bold text-xs sm:text-sm">Tiếp</button>
                </div>
              </div>
            )}

            {activeTab === "📝 Kiểm tra" && (
              <div>
                <div className="bg-white/5 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/10 mb-5 shadow-xl relative z-20">
                  <div className="relative mb-4">
                    <label className="block text-gray-400 font-bold mb-1.5 text-[11px] uppercase tracking-widest">Định Dạng Bài Kiểm Tra</label>
                    <button onClick={() => setIsQuizDropdownOpen(!isQuizDropdownOpen)} className={`w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm sm:text-base font-bold flex justify-between items-center ${currentTheme.textAccent}`}>
                      {quizMode}
                      <span>▼</span>
                    </button>
                    <AnimatePresence>
                      {isQuizDropdownOpen && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute w-full mt-1 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                          {QUIZ_MODES.map((m: any) => (
                            <button key={m} onClick={() => { setQuizMode(m); setIsQuizDropdownOpen(false); }} className={`w-full text-left p-3 text-xs sm:text-sm font-bold transition-colors ${quizMode === m ? `${currentTheme.bgBadge} ${currentTheme.textAccent}` : 'text-gray-300 hover:bg-white/5'}`}>
                              {m}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {quizMode === "Dạng 1 (Trắc nghiệm)" && (
                    <div className="mb-4">
                      <label className="block text-gray-400 font-bold mb-2 text-[11px] uppercase tracking-widest">Số lượng: <span className="text-white text-sm">{numQuestions}</span></label>
                      <input type="range" min="5" max="50" step="5" value={numQuestions} onChange={(e: any) => setNumQuestions(e.target.value)} className={`w-full cursor-pointer h-1.5 bg-gray-800 rounded-lg appearance-none ${currentTheme.accentClass}`} />
                    </div>
                  )}
                  
                  <button onClick={loadQuiz} className={`w-full py-3 bg-gradient-to-r ${currentTheme.primaryGradient} text-white rounded-xl font-bold text-xs sm:text-sm tracking-widest uppercase shadow-md`}>
                    TẠO ĐỀ THI
                  </button>
                </div>

                {quizQuestions.length > 0 && (
                  <div>
                    {quizMode === "Dạng 1 (Trắc nghiệm)" ? (
                      <div className="space-y-4">
                        {quizQuestions.map((q: any, i: number) => (
                          <div key={i} className="bg-white/5 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/10 shadow-lg">
                            <h3 className="text-base sm:text-xl font-bold mb-2.5 text-white">{q.title}</h3>
                            {q.subtitle && (
                              <div className="mb-3 p-2.5 rounded-lg bg-black/30 border border-white/5 text-gray-300 text-xs sm:text-sm flex flex-wrap gap-x-3 gap-y-1.5">
                                {q.subtitle.split("  |  ").map((info: any, idx: number) => <span key={idx}>{info}</span>)}
                              </div>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {(q.options || []).map((opt: any, optIdx: number) => {
                                const isSelected = dang1Answers[i] === opt;
                                const isCorrectAnswer = opt === q.answer;
                                let btnClass = "bg-black/40 border-white/10 text-gray-300";

                                if (!dang1Submitted) {
                                  if (isSelected) btnClass += ` ${currentTheme.selectedAns}`;
                                  else btnClass += ` ${currentTheme.hoverAns}`;
                                } else {
                                  if (isCorrectAnswer) btnClass += " bg-green-600 border-green-300 text-white";
                                  else if (isSelected && !isCorrectAnswer) btnClass += " bg-red-600 border-red-300 text-white";
                                  else btnClass += " bg-black/40 border-gray-800 text-gray-500 opacity-50";
                                }

                                return (
                                  <button key={optIdx} onClick={() => handleDang1Select(i, opt)} disabled={dang1Submitted} className={`p-3 rounded-xl border font-bold text-xs sm:text-sm text-left flex items-center gap-2.5 ${btnClass}`}>
                                    <span className="w-6 h-6 flex items-center justify-center rounded bg-white/10 text-xs">
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                        
                        {!dang1Submitted ? (
                          <button onClick={handleSubmitDang1} className="w-full py-3.5 bg-white text-black font-bold text-sm sm:text-base rounded-xl mt-4 shadow-xl">
                            📤 NỘP BÀI
                          </button>
                        ) : (
                          <div className="mt-6 p-6 sm:p-8 bg-black/60 rounded-2xl text-center border border-white/20 shadow-xl">
                            <h2 className="text-2xl font-bold mb-2 text-white">🎉 Đã hoàn thành!</h2>
                            <p className={`text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${currentTheme.textGradient} mb-2`}>{calculateDang1Score()} <span className="text-xl text-gray-400">/ {quizQuestions.length}</span></p>
                            <button onClick={loadQuiz} className={`mt-4 px-6 py-3 w-full bg-gradient-to-r ${currentTheme.primaryGradient} text-white font-bold rounded-xl text-sm`}>
                              LÀM ĐỀ MỚI 🔄
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        {quizIdx >= quizQuestions.length ? (
                          <div className="mt-6 p-6 sm:p-8 bg-black/60 rounded-2xl text-center border border-white/20 shadow-xl">
                            <h2 className="text-2xl font-bold mb-2 text-white">🎉 Đã hoàn thành!</h2>
                            <button onClick={loadQuiz} className={`mt-4 px-6 py-3 w-full bg-gradient-to-r ${currentTheme.primaryGradient} text-white font-bold rounded-xl text-sm`}>
                              LÀM ĐỀ MỚI 🔄
                            </button>
                          </div>
                        ) : (
                          <div className="bg-white/5 backdrop-blur-xl p-5 sm:p-8 rounded-2xl border border-white/10 shadow-xl">
                            <h2 className="text-xl sm:text-2xl font-bold mb-3 text-white">{quizQuestions[quizIdx].title}</h2>
                            {quizQuestions[quizIdx].subtitle && (
                               <div className="mb-4 p-3 rounded-xl bg-black/40 border border-white/5 text-xs sm:text-sm text-gray-300">
                                 {quizQuestions[quizIdx].subtitle}
                               </div>
                            )}
                            
                            {quizQuestions[quizIdx].type === 'typing' ? (
                              <div>
                                <input autoFocus type="text" value={userTyped} onChange={(e: any) => setUserTyped(e.target.value)} className={`w-full p-3.5 rounded-xl bg-black/50 border border-white/10 ${currentTheme.borderFocus} text-center text-xl font-bold mb-4 outline-none text-white`} placeholder="Gõ đáp án..." />
                                <button onClick={() => checkQuizAnswer(userTyped)} className={`w-full py-3 bg-gradient-to-r ${currentTheme.primaryGradient} text-white font-bold rounded-xl text-sm`}>KIỂM TRA</button>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                {(quizQuestions[quizIdx].options || []).map((opt: any, i: number) => {
                                  let btnClass = "bg-black/40 border-white/10 text-gray-200";
                                  if (quizFeedback) {
                                    if (opt === quizQuestions[quizIdx].answer) btnClass += " bg-green-600 border-green-300 text-white";
                                    else if (quizFeedback.clickedOpt === opt) btnClass += " bg-red-600 border-red-300 text-white";
                                    else btnClass += " bg-black/40 border-gray-800 text-gray-600 opacity-50";
                                  } else {
                                    btnClass += ` ${currentTheme.hoverAns}`;
                                  }

                                  return (
                                    <button key={i} onClick={() => checkQuizAnswer(opt)} disabled={quizFeedback !== null} className={`p-3.5 rounded-xl font-bold border text-xs sm:text-sm text-left flex items-center gap-2.5 ${btnClass}`}>
                                      <span className="w-6 h-6 flex items-center justify-center rounded bg-white/10 text-xs">{i+1}</span>
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {quizFeedback && (
                              <div className="mt-4 text-center">
                                <div className={`p-3 rounded-xl mb-3 border ${quizFeedback.isCorrect ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-red-500/10 border-red-500 text-red-400'}`}>
                                  <p className="font-bold text-sm sm:text-base">{quizFeedback.msg}</p>
                                </div>
                                <button onClick={() => { setQuizFeedback(null); setUserTyped(''); setQuizIdx(p => p + 1); }} className="px-6 py-2.5 bg-white text-black font-bold rounded-xl text-xs sm:text-sm shadow-lg">CÂU TIẾP THEO ➡️</button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "📊 Lịch sử Câu sai" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Câu sai</h2>
                  {wrongAnswers.length > 0 && (
                    <button onClick={() => setWrongAnswers([])} className="bg-red-500/20 text-red-400 border border-red-500/50 px-3 py-1.5 rounded-xl text-xs font-bold">Xóa 🗑️</button>
                  )}
                </div>

                {wrongAnswers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...wrongAnswers].reverse().map((item: any, idx: number) => (
                      <div key={idx} className="bg-white/5 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-white/10 shadow-lg relative">
                        <span className="absolute top-0 right-0 bg-white/10 text-gray-300 text-[9px] px-2.5 py-0.5 rounded-bl-xl font-bold">{item.mode}</span>
                        <p className="font-bold text-base sm:text-lg text-white mb-1.5">{item.question}</p>
                        {item.info && <p className="text-[11px] text-gray-400 mb-3 bg-black/40 inline-block px-2.5 py-0.5 rounded">{item.info}</p>}
                        
                        <div className="flex flex-col gap-1.5">
                          <div className="bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg text-xs">
                            <span className="text-red-300">Bạn chọn: <strong className="text-red-400">{item.userAnswer}</strong></span>
                          </div>
                          <div className="bg-green-500/10 border border-green-500/20 p-2.5 rounded-lg text-xs">
                            <span className="text-green-300">Đáp án đúng: <strong className="text-green-400">{item.correctAnswer}</strong></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center">
                    <span className="text-4xl mb-2 block">🏆</span>
                    <h3 className="text-xl font-bold text-white mb-1">Chưa có câu sai!</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">Hãy hoàn thành các bài kiểm tra nhé.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "🤖 Trợ lý AI" && (
              <div className="flex flex-col h-[75vh] bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 shadow-2xl">
                <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/10">
                  <div className={`w-8 h-8 ${currentTheme.bgAccent} rounded-lg flex items-center justify-center text-sm`}>🤖</div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">AI Tutor</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto mb-4 pr-2 flex flex-col gap-3 custom-scrollbar text-xs sm:text-sm">
                  {chatMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full opacity-40">
                      <span className="text-4xl mb-2">✨</span>
                      <p className="font-medium text-center">Hỏi AI về từ vựng, ngữ pháp...</p>
                    </div>
                  )}
                  {chatMessages.map((msg: any, i: number) => (
                    <div key={i} className={`p-3.5 rounded-xl max-w-[90%] leading-relaxed shadow ${msg.role === 'user' ? `bg-gradient-to-r ${currentTheme.primaryGradient} text-white self-end` : 'bg-black/40 border border-white/10 self-start text-gray-200'}`}>
                      {msg.role === 'user' ? (
                        <div className="whitespace-pre-wrap font-medium">{msg.content}</div>
                      ) : (
                        <ReactMarkdown>
                          {msg.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  ))}
                </div>
                <div className={`flex gap-2 bg-black/40 p-2 rounded-xl border border-white/10 ${currentTheme.borderFocus}`}>
                  <input type="text" value={chatInput} onChange={(e: any) => setChatInput(e.target.value)} onKeyDown={(e: any) => e.key === 'Enter' && sendAiMessage()} className="flex-1 bg-transparent outline-none text-xs sm:text-sm px-3 text-white" placeholder="Nhắn tin cho AI..." />
                  <button onClick={sendAiMessage} className={`bg-gradient-to-r ${currentTheme.primaryGradient} text-white font-bold px-5 py-2 rounded-lg text-xs`}>GỬI</button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}} />
    </div>
  );
}
