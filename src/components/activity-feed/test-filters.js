// Test script to verify filtering functionality
// This is a development utility to test the filter logic

const testPosts = [
  {
    id: 1,
    category: "announcement",
    author: "Principal Johnson",
    content:
      "🎉 Congratulations to our Grade 10 students for their outstanding performance in the Science Fair! #ScienceFair #Achievement",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    hashtags: ["ScienceFair", "Achievement"],
  },
  {
    id: 2,
    category: "sports",
    author: "Coach Martinez",
    content:
      "⚽ Great victory for our school football team! #Football #Victory #TeamSpirit",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    hashtags: ["Football", "Victory", "TeamSpirit"],
  },
  {
    id: 3,
    category: "academic",
    author: "Mrs. Sarah Wilson",
    content:
      "📚 Mathematics test for Grade 9 students tomorrow. #MathTest #Grade9 #Exam",
    date: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    hashtags: ["MathTest", "Grade9", "Exam"],
  },
];

// Test filtering function
const applyFilters = (posts, filters) => {
  let filtered = [...posts];

  // Search term filter
  if (filters?.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(
      (post) =>
        post.content.toLowerCase().includes(searchLower) ||
        post.author.toLowerCase().includes(searchLower) ||
        post.hashtags.some((tag) => tag.toLowerCase().includes(searchLower)),
    );
  }

  // Category filter
  if (filters?.category && filters.category !== "all") {
    filtered = filtered.filter((post) => post.category === filters.category);
  }

  // Date range filter
  if (filters?.dateRange?.start || filters?.dateRange?.end) {
    filtered = filtered.filter((post) => {
      const postDate = post.date;
      const startDate = filters.dateRange.start;
      const endDate = filters.dateRange.end;

      if (startDate && endDate) {
        return postDate >= startDate && postDate <= endDate;
      } else if (startDate) {
        return postDate >= startDate;
      } else if (endDate) {
        return postDate <= endDate;
      }
      return true;
    });
  }

  // Hashtag filter
  if (filters?.hashtags && filters.hashtags.length > 0) {
    filtered = filtered.filter((post) =>
      filters.hashtags.some((filterTag) =>
        post.hashtags.some((postTag) =>
          postTag.toLowerCase().includes(filterTag.toLowerCase()),
        ),
      ),
    );
  }

  return filtered;
};

// Test cases
const runTests = () => {
  console.log("🧪 Running Filter Tests...\n");

  // Test 1: Search filter
  console.log("Test 1: Search Filter");
  const searchResult = applyFilters(testPosts, { searchTerm: "football" });
  console.log(`Expected: 1 post, Got: ${searchResult.length}`);
  console.log(
    `✅ Search filter: ${searchResult.length === 1 ? "PASS" : "FAIL"}\n`,
  );

  // Test 2: Category filter
  console.log("Test 2: Category Filter");
  const categoryResult = applyFilters(testPosts, { category: "sports" });
  console.log(`Expected: 1 post, Got: ${categoryResult.length}`);
  console.log(
    `✅ Category filter: ${categoryResult.length === 1 ? "PASS" : "FAIL"}\n`,
  );

  // Test 3: Hashtag filter
  console.log("Test 3: Hashtag Filter");
  const hashtagResult = applyFilters(testPosts, { hashtags: ["Achievement"] });
  console.log(`Expected: 1 post, Got: ${hashtagResult.length}`);
  console.log(
    `✅ Hashtag filter: ${hashtagResult.length === 1 ? "PASS" : "FAIL"}\n`,
  );

  // Test 4: Date range filter
  console.log("Test 4: Date Range Filter");
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const dateResult = applyFilters(testPosts, {
    dateRange: { start: oneHourAgo, end: now },
  });
  console.log(`Expected: 2 posts, Got: ${dateResult.length}`);
  console.log(
    `✅ Date range filter: ${dateResult.length === 2 ? "PASS" : "FAIL"}\n`,
  );

  // Test 5: Combined filters
  console.log("Test 5: Combined Filters");
  const combinedResult = applyFilters(testPosts, {
    category: "academic",
    searchTerm: "math",
  });
  console.log(`Expected: 1 post, Got: ${combinedResult.length}`);
  console.log(
    `✅ Combined filters: ${combinedResult.length === 1 ? "PASS" : "FAIL"}\n`,
  );

  // Test 6: No results
  console.log("Test 6: No Results");
  const noResult = applyFilters(testPosts, { searchTerm: "nonexistent" });
  console.log(`Expected: 0 posts, Got: ${noResult.length}`);
  console.log(`✅ No results: ${noResult.length === 0 ? "PASS" : "FAIL"}\n`);

  console.log("🎉 All tests completed!");
};

// Export for use in development
export { applyFilters, runTests, testPosts };

// Uncomment to run tests in development
// runTests();
