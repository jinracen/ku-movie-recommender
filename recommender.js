// Movie Recommender Engine with Age Filtering and Mood Text Keyword Weighting

// Helper to determine age rating numerical values
const RatingMinAge = {
  "전체관람가": 0,
  "12세이상관람가": 12,
  "15세이상관람가": 15,
  "청소년관람불가": 19
};

// Keyword mapping dictionary for semantic matching in diary entry
const KeywordMap = {
  // Academic & Campus Stress
  "시험": ["시험", "학점", "공부", "성적", "과제", "퀴즈", "중간고사", "기말고사", "교수", "대학", "전공", "공과대학", "인문대학", "정경대학", "경영대학", "도서관", "중광", "백주년"],
  "힐링": ["힐링", "휴식", "쉼", "지친", "피곤", "쉬고", "자연", "캠핑", "시골", "고향", "여행", "방학", "종강"],
  "이별": ["이별", "헤어짐", "슬픔", "눈물", "헤어졌", "남자친구", "여자친구", "남친", "여친", "짝사랑", "헤어진", "실연", "아픔"],
  "성공": ["합격", "성공", "성취", "도전", "극복", "취업", "면접", "해냈다", "이겼다", "기쁨", "신남", "축하"],
  "우정": ["친구", "우정", "동아리", "학회", "선후배", "동기", "추억", "사람", "선배", "후배", "안암", "참살이"],
  "복수": ["복수", "부조리", "사이다", "폭발", "화남", "짜증", "분노", "격파", "스트레스", "답답"]
};

const Recommender = {
  // Recommend movies based on user's input
  // parameters:
  // - movies: Array of movie objects from movies.json
  // - userAge: Number, user's age
  // - selectedMood: String (e.g. "기쁨", "슬픔", "화남", "피곤", "불안")
  // - diaryText: String, user's detailed diary entry
  recommend: function(movies, userAge, selectedMood, diaryText, favoriteMovie) {
    if (!movies || !Array.isArray(movies)) return [];
    
    // 1. Age Filtering
    // Completely exclude movies where rating is higher than user's age
    const allowedMovies = movies.filter(movie => {
      const minAge = RatingMinAge[movie.rating] || 0;
      return userAge >= minAge;
    });

    // 2. Score calculation
    const scoredMovies = allowedMovies.map(movie => {
      let score = 0;

      // Base Mood Match: +10 points if movie supports the selected mood tag
      if (movie.moodTags.includes(selectedMood)) {
        score += 10;
      }

      // Keyword Mapping Match (Advanced Local NLP)
      // Check if user's diary contains keywords corresponding to movie's thematic tags
      const text = diaryText.toLowerCase();
      
      // Match general keywords stored in the movie data
      if (movie.keywords) {
        movie.keywords.forEach(keyword => {
          if (text.includes(keyword.toLowerCase())) {
            score += 5; // +5 points for direct keyword match in movie metadata
          }
        });
      }

      // Semantic Group Keyword Match (Matches related campus/life terms)
      Object.keys(KeywordMap).forEach(category => {
        const relatedWords = KeywordMap[category];
        // If the diary text matches words in a category, check if this movie fits
        const matchesCategory = relatedWords.some(word => text.includes(word));
        
        if (matchesCategory) {
          // If diary mentions '이별' (breakup) and movie has '이별', '사랑' keywords, boost it
          if (category === "이별" && (movie.keywords.includes("이별") || movie.keywords.includes("첫사랑") || movie.keywords.includes("사랑"))) {
            score += 7;
          }
          // If diary mentions '시험' (exam) and movie has '공부', '대학', '스트레스', '힐링' keywords, boost it
          if (category === "시험" && (movie.keywords.includes("대학") || movie.keywords.includes("공부") || movie.keywords.includes("스트레스") || movie.keywords.includes("웃음"))) {
            score += 7;
          }
          // If diary mentions '힐링' (healing) and movie has '요리', '자연', '힐링', '휴식' keywords
          if (category === "힐링" && (movie.keywords.includes("힐링") || movie.keywords.includes("자연") || movie.keywords.includes("일상") || movie.keywords.includes("조용함"))) {
            score += 7;
          }
          // If diary mentions '성공' (success) and movie has '성공', '도전', '극복', '실화' keywords
          if (category === "성공" && (movie.keywords.includes("성공") || movie.keywords.includes("도전") || movie.keywords.includes("극복"))) {
            score += 7;
          }
          // If diary mentions '복수' (revenge) and movie has '복수', '액션', '사이다', '스트레스' keywords
          if (category === "복수" && (movie.keywords.includes("복수") || movie.keywords.includes("액션") || movie.keywords.includes("사이다") || movie.keywords.includes("스트레스"))) {
            score += 7;
          }
          // If diary mentions '우정' (friendship) and movie has '친구', '우정', '추억' keywords
          if (category === "우정" && (movie.keywords.includes("친구") || movie.keywords.includes("우정") || movie.keywords.includes("추억"))) {
            score += 7;
          }
        }
      });

      // Favorite Movie Match: +15 points massive boost if this movie is what the user loves!
      if (favoriteMovie && favoriteMovie.trim() !== '') {
        const favClean = favoriteMovie.toLowerCase().replace(/\s+/g, '');
        const titleClean = movie.title.toLowerCase().replace(/\s+/g, '');
        if (titleClean.includes(favClean) || favClean.includes(titleClean)) {
          score += 15;
        }
      }

      return {
        movie,
        score
      };
    });

    // 3. Sorting by Score (descending) and filtering out 0 scores if possible
    // (If all scores are 0, fall back to base mood matching)
    scoredMovies.sort((a, b) => b.score - a.score);

    // Get top 3 movies
    const top3 = scoredMovies.slice(0, 3).map(sm => sm.movie);

    return top3;
  }
};

// Export for Node, or attach to window for Browser
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = Recommender;
} else {
  window.Recommender = Recommender;
}
