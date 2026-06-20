// Local database helper supporting both Node.js (Electron fs) and Web (localStorage)
let fs = null;
let path = null;
let useLocalStorage = true;
let dbFilePath = '';

try {
  // Check if we are running in an environment with Node fs (like Electron)
  if (typeof require !== 'undefined') {
    fs = require('fs');
    path = require('path');
    
    // In Electron, we can use the app's user data directory, 
    // but for a simple local portable version, we store it in the app folder.
    dbFilePath = path.join(__dirname, 'db.json');
    useLocalStorage = false;
  }
} catch (e) {
  useLocalStorage = true;
}

// Initial structure for our database
const initialData = {
  users: [],
  moodLogs: []
};

// Helper function to read database
function readDB() {
  if (useLocalStorage) {
    const data = localStorage.getItem('ku_movie_db');
    return data ? JSON.parse(data) : { ...initialData };
  } else {
    try {
      if (!fs.existsSync(dbFilePath)) {
        fs.writeFileSync(dbFilePath, JSON.stringify(initialData, null, 2), 'utf-8');
        return { ...initialData };
      }
      const fileContent = fs.readFileSync(dbFilePath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (err) {
      console.error("Error reading db file, falling back to localStorage", err);
      // Fallback to localStorage even in Node if file read fails
      const data = localStorage.getItem('ku_movie_db');
      return data ? JSON.parse(data) : { ...initialData };
    }
  }
}

// Helper function to write database
function writeDB(data) {
  if (useLocalStorage) {
    localStorage.setItem('ku_movie_db', JSON.stringify(data));
  } else {
    try {
      fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error("Error writing db file, falling back to localStorage", err);
      localStorage.setItem('ku_movie_db', JSON.stringify(data));
    }
  }
}

// DB Module API
const Database = {
  // Create a new user account
  registerUser: function(userData) {
    const db = readDB();
    
    // Check if ID already exists
    const existing = db.users.find(u => u.id === userData.id);
    if (existing) {
      return { success: false, message: "이미 사용 중인 아이디입니다." };
    }

    // Add user
    // userData fields: id, password, name, age, gender, favoriteMovie, favoriteGenre
    db.users.push(userData);
    writeDB(db);
    return { success: true, message: "회원가입이 완료되었습니다!" };
  },

  // Authenticate user login
  loginUser: function(id, password) {
    const db = readDB();
    const user = db.users.find(u => u.id === id && u.password === password);
    
    if (user) {
      // Remove password before returning user object for security
      const { password, ...safeUser } = user;
      return { success: true, user: safeUser };
    }
    return { success: false, message: "아이디 또는 비밀번호가 올바르지 않습니다." };
  },

  // Log today's mood
  logMood: function(userId, moodData) {
    const db = readDB();
    // moodData fields: date (YYYY-MM-DD), moodIcon, moodText, recommendedMovies (array of IDs)
    const logEntry = {
      id: Date.now().toString(),
      userId,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      ...moodData
    };

    db.moodLogs.push(logEntry);
    writeDB(db);
    return logEntry;
  },

  // Get mood logs for a specific user
  getMoodLogs: function(userId) {
    const db = readDB();
    return db.moodLogs
      .filter(log => log.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
};

// Export for Node, or attach to window for Browser
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = Database;
} else {
  window.Database = Database;
}
