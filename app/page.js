'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown'; 

// ==========================================
// CẤU HÌNH THEME (GIỮ NGUYÊN GLOW)
// ==========================================
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
    hoverAns: "hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-cyan-100 hover:shadow-[0_0_30px_rgba(6,182,212,0.8)]",
    selectedAns: "bg-gradient-to-r from-blue-600 to-cyan-600 border-cyan-300 text-white shadow-[0_0_25px_rgba(6,182,212,0.9)]"
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
    hoverAns: "hover:bg-rose-500/20 hover:border-rose-400 hover:text-rose-100 hover:shadow-[0_0_30px_rgba(244,63,94,0.8)]",
    selectedAns: "bg-gradient-to-r from-orange-600 to-rose-600 border-rose-300 text-white shadow-[0_0_25px_rgba(244,63,94,0.9)]"
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
    hoverAns: "hover:bg-emerald-500/20 hover:border-emerald-400 hover:text-emerald-100 hover:shadow-[0_0_30px_rgba(16,185,129,0.8)]",
    selectedAns: "bg-gradient-to-r from-teal-600 to-emerald-600 border-emerald-300 text-white shadow-[0_0_25px_rgba(16,185,129,0.9)]"
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
    hoverAns: "hover:bg-purple-500/20 hover:border-purple-400 hover:text-purple-100 hover:shadow-[0_0_30px_rgba(168,85,247,0.8)]",
    selectedAns: "bg-gradient-to-r from-fuchsia-600 to-purple-600 border-purple-300 text-white shadow-[0_0_25px_rgba(168,85,247,0.9)]"
  }
];

export default function HieuHubMaster() {
  const [currentTheme, setCurrentTheme] = useState(THEMES[0]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [activeTab, setActiveTab] = useState("💎 Flashcard"); 
  const [dbMode, setDbMode] = useState("Mẫu của Hieu");
  const [isDbDropdownOpen, setIsDbDropdownOpen] = useState(false);
  const [customSheetUrl, setCustomSheetUrl] = useState("");
  const defaultUrl = "https://docs.google.com/spreadsheets/d/1Cryecd2kF8cmpXGfhsKFenMT89XHhyaMJyx7wkeUxa4/edit#gid=1604492918";
  const currentSheetUrl = dbMode === "Mẫu của Hieu" ? defaultUrl : customSheetUrl;

  const [allData, setAllData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [alphaFilter, setAlphaFilter] = useState("ALL");
  const ALPHABETS = ['ALL', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const QUIZ_MODES = ["Dạng 1 (Trắc nghiệm)", "Dạng 2 (Làm đâu biết đó)", "Dạng 3 (Viết từ)", "Dạng 4 (Loại từ)", "Dạng 5 (Giới từ)", "Dạng 6 (Chọn từ)", "Dạng 7 (Đồng nghĩa)", "Dạng 8 (Trái nghĩa)"];
  const [quizMode, setQuizMode] = useState("Dạng 1 (Trắc nghiệm)");
  const [isQuizDropdownOpen, setIsQuizDropdownOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [userTyped, setUserTyped] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const [dang1Answers, setDang1Answers] = useState({});
  const [dang1Submitted, setDang1Submitted] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]);

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

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

  const changeTheme = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem("hieu_hub_theme", theme.id);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() !== "" && password === "hieuhub2026") {
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

  const checkQuizAnswer = (answer) => {
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

  const handleDang1Select = (qIndex, option) => {
    if (dang1Submitted) return;
    setDang1Answers(prev => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmitDang1 = () => {
    setDang1Submitted(true);
    const newMistakes = [];
    quizQuestions.forEach((q, i) => {
      const uAns = dang1Answers[i];
      if (uAns !== q.answer) {
        newMistakes.push({ question: q.title, info: q.subtitle, userAnswer: uAns || "Chưa chọn", correctAnswer: q.answer, mode: "Dạng 1 (Trắc nghiệm)" });
      }
    });
    if (newMistakes.length > 0) setWrongAnswers(prev => [...prev, ...newMistakes]);
  };

  const calculateDang1Score = () => {
    let score = 0;
    quizQuestions.forEach((q, i) => { if (dang1Answers[i] === q.answer) score += 1; });
    return score;
  };

  const sendAiMessage = async () => {
    if(!chatInput.trim()) return;
    const userMsg = { role: "user", content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    try {
      const res = await axios.post('https://hieu-hub-backend.onrender.com/api/ask-ai', { prompt: userMsg.content });
      setChatMessages(prev => [...prev, { role: "ai", content: res.data.reply }]);
    } catch(e) {}
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLoggedIn || activeTab !== "📝 Kiểm tra" || quizQuestions.length === 0) return;
      if (document.activeElement.tagName === 'INPUT' && quizMode !== "Dạng 3 (Viết từ)") return;
      if (quizIdx >= quizQuestions.length && quizMode !== "Dạng 1 (Trắc nghiệm)") return;

      if (e.key === 'Enter') {
        e.preventDefault(); 
        if (e.repeat) return;

        if (quizFeedback) {
          setQuizFeedback(null); setUserTyped(''); setQuizIdx(p => p + 1);
        } else if (quizMode === "Dạng 3 (Viết từ)") {
          checkQuizAnswer(userTyped);
        }
        return;
      }
      
      if (!quizFeedback && quizMode !== "Dạng 3 (Viết từ)" && quizMode !== "Dạng 1 (Trắc nghiệm)") {
        const currentQ = quizQuestions[quizIdx];
        if (!currentQ || !currentQ.options) return;
        const options = currentQ.options;
        if (e.key === '1' && options[0]) checkQuizAnswer(options[0]);
        if (e.key === '2' && options[1]) checkQuizAnswer(options[1]);
        if (e.key === '3' && options[2]) checkQuizAnswer(options[2]);
        if (e.key === '4' && options[3]) checkQuizAnswer(options[3]);
        if (e.key === '5' && options[4]) checkQuizAnswer(options[4]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, quizQuestions, quizIdx, quizFeedback, quizMode, userTyped, isLoggedIn]);

  const filteredDashboardData = allData.filter(item => {
    const word = (item['Từ'] || '').toLowerCase();
    const meaning = (item['Nghĩa'] || '').toLowerCase();
    const searchLow = searchTerm.toLowerCase();
    return (word.includes(searchLow) || meaning.includes(searchLow)) && (alphaFilter === 'ALL' || (item['Từ'] || '').toUpperCase().startsWith(alphaFilter));
  });

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#050505] font-sans bg-cover bg-fixed relative overflow-hidden" style={{ backgroundImage: `url('${currentTheme.bgUrl}')`, transition: 'background-image 0.5s ease' }}>
        <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-md z-0"></div>
        
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 bg-white/5 backdrop-blur-2xl p-10 rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] w-full max-w-md">
          <div className={`absolute -top-10 -right-10 w-32 h-32 blur-[40px] rounded-full pointer-events-none ${currentTheme.bgBadge}`}></div>
          <div className={`absolute -bottom-10 -left-10 w-32 h-32 blur-[40px] rounded-full pointer-events-none ${currentTheme.bgBadge}`}></div>
          
          <div className="text-center mb-8 relative z-20">
            <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${currentTheme.primaryGradient} rounded-3xl flex items-center justify-center ${currentTheme.shadowGlow} mb-4 border border-white/20`}>
              <span className="text-4xl">🚀</span>
            </div>
            <h1 className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white ${currentTheme.textGradient} tracking-tight`}>Hieu's Hub</h1>
            <p className="text-gray-400 mt-2 text-sm font-medium">Hệ thống ôn luyện TOEIC & AI Tutor</p>
          </div>

          <form onSubmit={handleLogin} className="relative z-20 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">Tên của bạn</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="VD: Hieu Dang..." className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none ${currentTheme.borderFocus} focus:bg-black/60 transition-colors shadow-inner`} />
            </div>
            
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">Mật khẩu</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Nhập mật khẩu..." className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none ${currentTheme.borderFocus} focus:bg-black/60 transition-colors shadow-inner`} />
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className={`w-full py-4 bg-gradient-to-r ${currentTheme.primaryGradient} text-white font-bold rounded-xl ${currentTheme.shadowGlow} tracking-widest uppercase text-sm mt-2`}>
              Đăng nhập ngay
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans bg-cover bg-fixed relative overflow-hidden transition-all duration-500 ease-in-out" style={{ backgroundImage: `url('${currentTheme.bgUrl}')` }}>
      <div className="absolute inset-0 bg-gray-950/85 backdrop-blur-[8px] z-0"></div>

      {/* --- SIDEBAR --- */}
      <div className="w-64 m-4 rounded-[1.5rem] bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col p-5 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative z-40 overflow-hidden">
        
        <div className={`absolute -top-20 -left-20 w-32 h-32 blur-[50px] rounded-full pointer-events-none ${currentTheme.bgBadge}`}></div>
        <div className={`absolute bottom-0 right-0 w-32 h-32 blur-[50px] rounded-full pointer-events-none ${currentTheme.bgBadge}`}></div>

        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-6 relative z-10 border-b border-white/10 pb-6">
          <div className={`w-12 h-12 mx-auto bg-gradient-to-br ${currentTheme.primaryGradient} rounded-full flex items-center justify-center ${currentTheme.shadowGlow} mb-3 border border-white/20`}>
            <span className="text-xl font-black">{username[0]?.toUpperCase()}</span>
          </div>
          <h2 className="text-sm font-bold text-gray-400">Xin chào,</h2>
          <h1 className={`text-lg font-black text-transparent bg-clip-text bg-gradient-to-r ${currentTheme.textGradient} truncate px-2`}>{username}</h1>
        </motion.div>

        <div className="flex flex-col gap-2 flex-1 relative z-10">
          <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.1em] mb-1 pl-2">Menu</h3>
          {MENUS.map(m => (
            <motion.button 
              key={m} onClick={() => setActiveTab(m)}
              whileHover={{ scale: 1.02, x: 3 }} whileTap={{ scale: 0.95 }}
              className={`text-left px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${activeTab === m ? `bg-gradient-to-r ${currentTheme.activeMenu} text-white shadow-lg border border-white/20` : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'} flex justify-between items-center`}
            >
              {m}
              {m === "📊 Lịch sử Câu sai" && wrongAnswers.length > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{wrongAnswers.length}</span>
              )}
            </motion.button>
          ))}
        </div>
        
        <div className="mt-2 relative z-50 bg-black/40 p-3 rounded-xl border border-white/5 mb-3">
          <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.1em] mb-2 flex items-center gap-1.5">
            <span>🎨</span> Đổi Chủ Đề
          </h3>
          <div className="flex justify-between gap-2">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => changeTheme(t)}
                title={t.name}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${currentTheme.id === t.id ? `border-white scale-110 shadow-lg` : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'} bg-gradient-to-br ${t.primaryGradient}`}
              />
            ))}
          </div>
        </div>

        <div className="relative z-50 bg-black/40 p-3 rounded-xl border border-white/5 mb-3">
          <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.1em] mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span> Database
          </h3>
          <div className="relative mb-2 z-[100]">
            <button onClick={() => setIsDbDropdownOpen(!isDbDropdownOpen)} className={`w-full bg-white/5 border border-white/10 hover:${currentTheme.borderBadge} rounded-lg px-3 py-2 text-xs font-medium text-white flex justify-between items-center transition-colors`}>
              {dbMode}
              <motion.span animate={{ rotate: isDbDropdownOpen ? 180 : 0 }} className="text-gray-400 text-[10px]">▼</motion.span>
            </button>
            <AnimatePresence>
              {isDbDropdownOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-full w-full mb-1 bg-[#0f172a] border border-white/10 rounded-lg shadow-2xl overflow-hidden z-[100]">
                  {["Mẫu của Hieu", "Sheets cá nhân"].map(m => (
                    <button key={m} onClick={() => { setDbMode(m); setIsDbDropdownOpen(false); }} className={`w-full text-left px-3 py-2 text-xs transition-colors ${dbMode === m ? `${currentTheme.bgBadge} ${currentTheme.textAccent}` : 'text-gray-300 hover:bg-white/5'}`}>
                      {m}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {dbMode === "Sheets cá nhân" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-2 overflow-hidden">
                <input type="text" placeholder="Dán link Google Sheets..." value={customSheetUrl} onChange={(e) => setCustomSheetUrl(e.target.value)} className={`w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none ${currentTheme.borderFocus} transition-colors shadow-inner`} />
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={loadAllData} className="w-full text-xs font-bold bg-white/10 hover:bg-white/20 py-2 rounded-lg transition-colors border border-white/5 text-gray-300">Đồng bộ ({allData.length})</button>
        </div>

        <button onClick={handleLogout} className="relative z-50 w-full text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 rounded-xl transition-colors border border-red-500/20 flex items-center justify-center gap-2">
          <span>🚪</span> Đăng xuất
        </button>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 relative scroll-smooth z-10">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="max-w-5xl mx-auto relative pb-10 pt-2">
            
            {activeTab === "⚙️ Dashboard Quản lý" && (
              <div>
                <h2 className={`text-3xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r ${currentTheme.textGradient}`}>Kho Từ Vựng</h2>
                <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 mb-6 shadow-xl flex flex-col md:flex-row gap-4 items-center relative z-20">
                  <input type="text" placeholder="🔍 Tìm kiếm từ vựng..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-base text-white outline-none ${currentTheme.borderFocus} transition-colors shadow-inner w-full`} />
                  <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/10 overflow-x-auto w-full md:w-auto">
                    {ALPHABETS.slice(0, 10).map(letter => <button key={letter} onClick={() => setAlphaFilter(letter)} className={`min-w-[32px] h-8 rounded-lg font-bold transition-all text-xs ${alphaFilter === letter ? `${currentTheme.bgAccent} text-white shadow-lg` : 'text-gray-400 hover:bg-white/10'}`}>{letter}</button>)}
                    <span className="text-gray-600 self-center px-1 text-xs">...</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredDashboardData.length > 0 ? filteredDashboardData.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: (i % 15) * 0.02 }} whileHover={{ y: -4 }} className={`bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 shadow-lg hover:${currentTheme.shadowGlow} hover:bg-white/10 transition-all cursor-default group relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity"><span className={`text-5xl font-black ${currentTheme.textAccent}`}>{item['Từ'][0]?.toUpperCase()}</span></div>
                      <div className="flex justify-between items-start mb-3">
                        <p className="font-bold text-xl text-white tracking-tight">{item['Từ']}</p>
                        <span className={`${currentTheme.bgBadge} ${currentTheme.textAccent} text-[10px] font-bold px-2 py-1 rounded-md border ${currentTheme.borderBadge}`}>{item['Loại'] || 'Word'}</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-3 font-mono">/{item['Phát âm']}/</p>
                      <p className="text-gray-200 text-base">{item['Nghĩa']}</p>
                      {item['Giới từ'] && <p className={`${currentTheme.textAccent} text-xs mt-3 font-bold bg-white/5 inline-block px-2 py-1 rounded-md border border-white/5`}>+ {item['Giới từ']}</p>}
                    </motion.div>
                  )) : <p className="text-gray-500 col-span-3 text-center text-lg mt-8">Kho từ vựng trống.</p>}
                </div>
              </div>
            )}

            {activeTab === "💎 Flashcard" && allData.length > 0 && (
              <div className="flex flex-col items-center pt-4">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-px w-16 bg-gradient-to-r from-transparent to-gray-500"></span>
                  <p className="text-gray-400 tracking-[0.2em] font-bold text-xs">THẺ {flashcardIdx + 1} / {allData.length}</p>
                  <span className="h-px w-16 bg-gradient-to-l from-transparent to-gray-500"></span>
                </div>

                <div className="w-full max-w-2xl h-[360px] cursor-pointer mb-8" onClick={() => setIsFlipped(!isFlipped)} style={{ perspective: '1200px' }}>
                  <motion.div className="w-full h-full relative" style={{ transformStyle: 'preserve-3d' }} animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.5, type: "spring", stiffness: 80, damping: 15 }}>
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-[2rem] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col justify-center items-center p-8 overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                      <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${currentTheme.primaryGradient}`}></div>
                      <span className={`absolute top-6 left-6 ${currentTheme.textAccent} opacity-50 text-xs font-bold tracking-[0.2em] flex items-center gap-1.5`}><span className={`w-1.5 h-1.5 rounded-full ${currentTheme.bgAccent}`}></span> FRONT</span>
                      <h1 className="text-5xl md:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 tracking-tight text-center">{allData[flashcardIdx]['Từ']}</h1>
                      <div className="flex items-center gap-3">
                        <span className={`${currentTheme.textAccent} text-2xl font-mono italic opacity-80`}>/{allData[flashcardIdx]['Phát âm']}/</span>
                        {allData[flashcardIdx]['Loại'] && <span className="bg-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20">{allData[flashcardIdx]['Loại']}</span>}
                      </div>
                      <p className="absolute bottom-6 text-gray-500 text-xs animate-pulse tracking-widest">CLICK LẬT THẺ</p>
                    </div>

                    <div className={`absolute inset-0 bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-[2rem] border ${currentTheme.borderBadge} shadow-2xl flex flex-col justify-center items-center p-8 overflow-hidden`} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                      <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${currentTheme.primaryGradient}`}></div>
                      <span className={`absolute top-6 left-6 ${currentTheme.textAccent} opacity-50 text-xs font-bold tracking-[0.2em] flex items-center gap-1.5`}><span className={`w-1.5 h-1.5 rounded-full ${currentTheme.bgAccent}`}></span> BACK</span>
                      <h1 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] text-center leading-snug">{allData[flashcardIdx]['Nghĩa']}</h1>
                      <div className="flex flex-wrap justify-center gap-2 w-full">
                        {allData[flashcardIdx]['Giới từ'] && <span className="bg-blue-500/20 text-blue-300 px-3 py-1.5 text-sm rounded-xl font-semibold border border-blue-500/20">+ {allData[flashcardIdx]['Giới từ']}</span>}
                        {allData[flashcardIdx]['Đồng nghĩa'] && <span className="bg-green-500/20 text-green-400 px-3 py-1.5 text-sm rounded-xl font-semibold border border-green-500/20">= {allData[flashcardIdx]['Đồng nghĩa']}</span>}
                        {allData[flashcardIdx]['Trái nghĩa'] && <span className="bg-red-500/20 text-red-400 px-3 py-1.5 text-sm rounded-xl font-semibold border border-red-500/20">≠ {allData[flashcardIdx]['Trái nghĩa']}</span>}
                      </div>
                    </div>

                  </motion.div>
                </div>
                <div className="flex gap-3 w-full max-w-lg">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setFlashcardIdx(p => Math.max(0, p - 1)); setIsFlipped(false); }} className="flex-1 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-bold text-sm transition-all">Lùi lại</motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsFlipped(!isFlipped)} className={`flex-[2] py-3.5 bg-gradient-to-r ${currentTheme.primaryGradient} text-white rounded-xl font-bold text-base ${currentTheme.shadowGlow}`}>LẬT THẺ</motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setFlashcardIdx(p => Math.min(allData.length - 1, p + 1)); setIsFlipped(false); }} className="flex-1 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-bold text-sm transition-all">Tiếp theo</motion.button>
                </div>
              </div>
            )}

            {activeTab === "📝 Kiểm tra" && (
              <div>
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[1.5rem] border border-white/10 mb-6 shadow-xl relative z-[100]">
                  <div className="relative mb-6 z-[100]">
                    <label className="block text-gray-400 font-bold mb-2 text-xs uppercase tracking-widest">Định Dạng Bài Kiểm Tra</label>
                    <button onClick={() => setIsQuizDropdownOpen(!isQuizDropdownOpen)} className={`w-full bg-black/40 border border-white/10 rounded-xl p-4 text-base font-bold flex justify-between items-center ${currentTheme.textAccent} hover:${currentTheme.bgBadge} transition-colors shadow-inner`}>
                      {quizMode}
                      <motion.span animate={{ rotate: isQuizDropdownOpen ? 180 : 0 }}>▼</motion.span>
                    </button>
                    <AnimatePresence>
                      {isQuizDropdownOpen && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute w-full mt-2 bg-[#0f172a] border border-white/10 rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.8)] overflow-hidden z-[100]">
                          {QUIZ_MODES.map(m => (
                            <button key={m} onClick={() => { setQuizMode(m); setIsQuizDropdownOpen(false); }} className={`w-full text-left p-3.5 text-sm font-bold transition-colors ${quizMode === m ? `${currentTheme.bgBadge} ${currentTheme.textAccent} border-l-4 ${currentTheme.borderAccent}` : 'text-gray-300 hover:bg-white/5 border-l-4 border-transparent'}`}>
                              {m}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <AnimatePresence>
                    {quizMode === "Dạng 1 (Trắc nghiệm)" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
                        <label className="block text-gray-400 font-bold mb-3 text-xs uppercase tracking-widest">Số lượng: <span className="text-white text-lg ml-1">{numQuestions}</span></label>
                        <input type="range" min="5" max="50" step="5" value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)} className={`w-full cursor-pointer h-1.5 bg-gray-800 rounded-lg appearance-none ${currentTheme.accentClass}`} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={loadQuiz} className={`w-full py-4 bg-gradient-to-r ${currentTheme.primaryGradient} text-white rounded-xl font-bold text-sm tracking-widest uppercase transition-all shadow-md`}>
                    TẠO ĐỀ THI
                  </motion.button>
                </div>

                {quizQuestions.length > 0 && (
                  <div>
                    {quizMode === "Dạng 1 (Trắc nghiệm)" ? (
                      <div className="space-y-4">
                        {quizQuestions.map((q, i) => (
                          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg relative z-0">
                            <h3 className="text-xl font-bold mb-3 text-white">{q.title}</h3>
                            {q.subtitle && (
                              <div className="mb-4 p-3 rounded-lg bg-black/30 border border-white/5 text-gray-300 text-sm flex flex-wrap gap-x-4 gap-y-2 font-medium">
                                {q.subtitle.split("  |  ").map((info, idx) => <span key={idx} className="flex items-center">{info}</span>)}
                              </div>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {(q.options || []).map((opt, optIdx) => {
                                const isSelected = dang1Answers[i] === opt;
                                const isCorrectAnswer = opt === q.answer;
                                
                                // FIX: Loại bỏ transition-all để không bị đụng độ Framer Motion
                                let btnClass = "bg-black/40 border-white/10 text-gray-300 transition-colors transition-shadow duration-300";
                                let iconClass = "bg-white/10 text-gray-400 transition-colors duration-300";

                                if (!dang1Submitted) {
                                  if (isSelected) {
                                    btnClass += ` ${currentTheme.selectedAns}`; // Màu nền sáng nổi lên khi Đã chọn
                                    iconClass = "bg-white/20 text-white";
                                  } else {
                                    btnClass += ` ${currentTheme.hoverAns}`; // Dải đèn mờ khi Di chuột
                                  }
                                } else {
                                  if (isCorrectAnswer) {
                                    btnClass += " bg-green-600 border-green-300 text-white shadow-[0_0_20px_rgba(34,197,94,0.7)]";
                                    iconClass = "bg-white/20 text-white";
                                  }
                                  else if (isSelected && !isCorrectAnswer) {
                                    btnClass += " bg-red-600 border-red-300 text-white shadow-[0_0_20px_rgba(244,63,94,0.7)]";
                                    iconClass = "bg-white/20 text-white";
                                  }
                                  else {
                                    btnClass += " bg-black/40 border-gray-800 text-gray-500 opacity-50";
                                    iconClass = "bg-white/5 text-gray-600";
                                  }
                                }

                                return (
                                  <motion.button key={optIdx} 
                                    initial={false}
                                    animate={{ scale: isSelected && !dang1Submitted ? 1.02 : 1 }} // Nảy bự lên khi được chọn
                                    whileHover={!dang1Submitted && !isSelected ? { scale: 1.03 } : {}} // Phóng to nhẹ khi di chuột
                                    whileTap={!dang1Submitted ? { scale: 0.95 } : {}} 
                                    onClick={() => handleDang1Select(i, opt)} 
                                    disabled={dang1Submitted} 
                                    className={`p-4 rounded-xl border font-bold text-base text-left flex items-center gap-3 ${btnClass}`}
                                  >
                                    <span className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-bold ${iconClass}`}>
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    {opt}
                                  </motion.button>
                                );
                              })}
                            </div>
                          </motion.div>
                        ))}
                        
                        {!dang1Submitted ? (
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmitDang1} className="w-full py-4 bg-white text-black font-bold text-lg rounded-2xl mt-6 shadow-xl">
                            📤 NỘP BÀI
                          </motion.button>
                        ) : (
                          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 p-10 bg-black/60 backdrop-blur-xl rounded-3xl text-center border border-white/20 shadow-2xl relative z-0">
                            <h2 className="text-3xl font-bold mb-4 text-white">🎉 Đã hoàn thành!</h2>
                            <p className={`text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r ${currentTheme.textGradient} mb-2`}>{calculateDang1Score()} <span className="text-3xl text-gray-400">/ {quizQuestions.length}</span></p>
                            <p className={`${currentTheme.textAccent} mt-2 text-sm font-bold tracking-widest uppercase`}>Chính xác: {Math.round((calculateDang1Score() / quizQuestions.length) * 100)}%</p>
                            
                            {calculateDang1Score() < quizQuestions.length && (
                              <p className="mt-6 text-gray-300 bg-white/5 border border-white/10 py-3 rounded-xl inline-block px-6">
                                Bạn đã sai <span className="font-bold text-red-400">{quizQuestions.length - calculateDang1Score()}</span> câu. Đã lưu vào Sidebar!
                              </p>
                            )}

                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={loadQuiz} className={`mt-8 px-10 py-4 w-full bg-gradient-to-r ${currentTheme.primaryGradient} text-white font-bold rounded-xl ${currentTheme.shadowGlow} text-lg`}>
                              LÀM ĐỀ MỚI 🔄
                            </motion.button>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      // DẠNG 2-8
                      <div>
                        {quizIdx >= quizQuestions.length ? (
                          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 p-10 bg-black/60 backdrop-blur-xl rounded-3xl text-center border border-white/20 shadow-2xl relative z-0">
                            <h2 className="text-3xl font-bold mb-4 text-white">🎉 Đã hoàn thành!</h2>
                            <p className="text-gray-300 mb-6">Bạn đã hoàn thành bộ câu hỏi Dạng {quizMode}.</p>
                            
                            {wrongAnswers.filter(w => w.mode === quizMode).length > 0 && (
                              <p className="mt-4 text-gray-300 bg-white/5 border border-white/10 py-3 rounded-xl inline-block px-6">
                                Phát hiện <span className="font-bold text-red-400">{wrongAnswers.filter(w => w.mode === quizMode).length}</span> lỗi sai. Đã lưu vào Sidebar!
                              </p>
                            )}

                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={loadQuiz} className={`mt-8 px-10 py-4 w-full bg-gradient-to-r ${currentTheme.primaryGradient} text-white font-bold rounded-xl ${currentTheme.shadowGlow} text-lg`}>
                              LÀM ĐỀ MỚI 🔄
                            </motion.button>
                          </motion.div>
                        ) : (
                          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-xl relative z-0">
                            <div className="absolute top-6 right-6 text-gray-500 text-[10px] font-mono flex gap-3 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                              {quizMode === "Dạng 3 (Viết từ)" ? <span>[ENTER] Nộp</span> : <span>[1-4] Chọn</span>}
                              {quizFeedback && <span>[ENTER] Tiếp</span>}
                            </div>

                            <h2 className="text-3xl font-bold mb-4 leading-tight text-white">{quizQuestions[quizIdx].title}</h2>
                            {quizQuestions[quizIdx].subtitle && (
                               <div className={`mb-6 p-4 rounded-xl bg-black/40 border border-white/5 ${currentTheme.textAccent} text-sm flex flex-wrap gap-x-5 gap-y-2 font-medium`}>
                                 {quizQuestions[quizIdx].subtitle.split("  |  ").map((info, idx) => <span key={idx}>{info}</span>)}
                               </div>
                            )}
                            
                            {quizQuestions[quizIdx].type === 'typing' ? (
                              <div className="mt-6">
                                <input autoFocus type="text" value={userTyped} onChange={(e) => setUserTyped(e.target.value)} className={`w-full p-5 rounded-2xl bg-black/50 border border-white/10 ${currentTheme.borderFocus} text-center text-2xl font-bold mb-5 outline-none transition-colors shadow-inner text-white`} placeholder="Gõ đáp án..." />
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => checkQuizAnswer(userTyped)} className={`w-full py-4 bg-gradient-to-r ${currentTheme.primaryGradient} text-white font-bold text-lg rounded-2xl shadow-md`}>KIỂM TRA</motion.button>
                              </div>
                            ) : (
                              <div className={`grid gap-4 mt-6 ${quizMode === "Dạng 4 (Loại từ)" || quizMode === "Dạng 5 (Giới từ)" ? 'grid-cols-3 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`}>
                                {(quizQuestions[quizIdx].options || []).map((opt, i) => {
                                  
                                  // FIX: Loại bỏ transition-all để bảo toàn hiệu ứng nhún nhảy Framer
                                  let btnClass = "bg-black/40 border-white/10 text-gray-200 transition-colors transition-shadow duration-300";
                                  let iconClass = "bg-white/10 text-gray-400 transition-colors duration-300";
                                  
                                  if (quizFeedback) {
                                    if (opt === quizQuestions[quizIdx].answer) {
                                      btnClass += " bg-green-600 border-green-300 text-white shadow-[0_0_20px_rgba(34,197,94,0.7)]";
                                      iconClass = "bg-white/20 text-white";
                                    } else if (quizFeedback.clickedOpt === opt) {
                                      btnClass += " bg-red-600 border-red-300 text-white shadow-[0_0_20px_rgba(244,63,94,0.7)]";
                                      iconClass = "bg-white/20 text-white";
                                    } else {
                                      btnClass += " bg-black/40 border-gray-800 text-gray-600 opacity-50";
                                      iconClass = "bg-white/5 text-gray-600";
                                    }
                                  } else {
                                    btnClass += ` ${currentTheme.hoverAns}`; // Dải đèn mờ khi Di chuột (Dạng 2-8)
                                  }

                                  return (
                                    <motion.button key={i} 
                                      initial={false}
                                      animate={{ scale: quizFeedback && quizFeedback.clickedOpt === opt ? 1.02 : 1 }} // Nổi bự khi click
                                      whileHover={!quizFeedback ? { scale: 1.03 } : {}} 
                                      whileTap={!quizFeedback ? { scale: 0.95 } : {}} 
                                      onClick={() => checkQuizAnswer(opt)} 
                                      disabled={quizFeedback !== null} 
                                      className={`p-4 rounded-2xl font-bold border text-base text-left flex items-center gap-3 ${btnClass}`}
                                    >
                                      {quizMode !== "Dạng 4 (Loại từ)" && quizMode !== "Dạng 5 (Giới từ)" && (
                                        <span className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold ${iconClass}`}>
                                          {i+1}
                                        </span>
                                      )} 
                                      {opt}
                                    </motion.button>
                                  );
                                })}
                              </div>
                            )}
                            <AnimatePresence>
                              {quizFeedback && (
                                <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 30 }} exit={{ opacity: 0, height: 0 }} className="text-center overflow-hidden">
                                  <div className={`p-5 rounded-2xl mb-5 border-2 ${quizFeedback.isCorrect ? 'bg-green-500/10 border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-red-500/10 border-red-500 text-red-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]'}`}>
                                    <p className="font-bold text-xl">{quizFeedback.msg}</p>
                                  </div>
                                  <button onClick={() => { setQuizFeedback(null); setUserTyped(''); setQuizIdx(p => p + 1); }} className="px-10 py-3.5 bg-white text-black font-bold rounded-xl text-sm hover:bg-gray-200 transition-colors shadow-lg">CÂU TIẾP THEO ➡️</button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "📊 Lịch sử Câu sai" && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Câu sai cần ôn tập</h2>
                  {wrongAnswers.length > 0 && (
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setWrongAnswers([])} className="bg-red-500/20 text-red-400 border border-red-500/50 px-4 py-2 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(239,68,68,0.3)]">Xóa lịch sử 🗑️</motion.button>
                  )}
                </div>

                {wrongAnswers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[...wrongAnswers].reverse().map((item, idx) => (
                      <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10 shadow-lg relative overflow-hidden">
                        <span className="absolute top-0 right-0 bg-white/10 text-gray-300 text-[10px] px-3 py-1 rounded-bl-xl font-bold">{item.mode}</span>
                        <p className="font-bold text-xl text-white mb-2">{item.question}</p>
                        {item.info && <p className="text-xs text-gray-400 mb-4 bg-black/40 inline-block px-3 py-1 rounded-lg">{item.info}</p>}
                        
                        <div className="flex flex-col gap-2 mt-2">
                          <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-start gap-2">
                            <span className="text-red-400">❌</span>
                            <span className="text-red-300 text-sm">Bạn chọn: <span className="font-bold text-red-400 block">{item.userAnswer}</span></span>
                          </div>
                          <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl flex items-start gap-2">
                            <span className="text-green-400">✅</span>
                            <span className="text-green-300 text-sm">Đáp án đúng: <span className="font-bold text-green-400 block">{item.correctAnswer}</span></span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl text-center shadow-xl">
                    <span className="text-6xl mb-4 block">🏆</span>
                    <h3 className="text-2xl font-bold text-white mb-2">Quá xuất sắc!</h3>
                    <p className="text-gray-400">Bạn chưa làm sai câu nào hoặc chưa có dữ liệu sai. Hãy tiếp tục làm bài kiểm tra nhé!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "🤖 Trợ lý AI" && (
              <div className="flex flex-col h-[75vh] bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 shadow-2xl relative z-10">
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/10">
                  <div className={`w-10 h-10 ${currentTheme.bgAccent} rounded-xl flex items-center justify-center text-xl ${currentTheme.shadowGlow}`}>🤖</div>
                  <h2 className="text-2xl font-bold text-white">AI Tutor</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto mb-6 pr-3 flex flex-col gap-4 scroll-smooth custom-scrollbar">
                  {chatMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full opacity-40">
                      <span className="text-5xl mb-3">✨</span>
                      <p className="text-base font-medium">Hỏi AI về từ vựng, ngữ pháp...</p>
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-2xl max-w-[85%] leading-relaxed text-sm shadow-lg ${msg.role === 'user' ? `bg-gradient-to-r ${currentTheme.primaryGradient} text-white self-end rounded-br-sm` : 'bg-black/40 border border-white/10 self-start rounded-bl-sm text-gray-200'}`}>
                      {msg.role === 'user' ? (
                        <div className="whitespace-pre-wrap font-medium">{msg.content}</div>
                      ) : (
                        <ReactMarkdown 
                          components={{
                            p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                            strong: ({node, ...props}) => <strong className={`font-bold ${currentTheme.textAccent}`} {...props} />,
                            em: ({node, ...props}) => <em className="italic text-gray-400" {...props} />,
                            code: ({node, ...props}) => <code className={`bg-white/10 ${currentTheme.textAccent} px-1.5 py-0.5 rounded text-xs font-mono`} {...props} />
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      )}
                    </motion.div>
                  ))}
                </div>
                <div className={`flex gap-3 bg-black/40 p-2.5 rounded-full border border-white/10 ${currentTheme.borderFocus} transition-colors shadow-inner`}>
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendAiMessage()} className="flex-1 bg-transparent outline-none text-base px-4 text-white" placeholder="Nhắn tin cho AI..." />
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={sendAiMessage} className={`bg-gradient-to-r ${currentTheme.primaryGradient} text-white font-bold px-8 rounded-full text-sm ${currentTheme.shadowGlow}`}>GỬI</motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />
    </div>
  );
}
