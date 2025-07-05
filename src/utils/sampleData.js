export const sampleUserData = {
  user_id: 1,
  user_type: 3, // Parent
  full_name: "John Doe",
  logo_url: require("../assets/images/nexis-logo.png"), // Default logo
  students: [
    {
      id: 101,
      name: "Alice Doe",
      groups: [
        {
          id: 1,
          name: "Yakkala Campus - Soccer",
          role: "Parent",
          member_count: 15,
          updates: "50+ Updates",
        },
        {
          id: 2,
          name: "Main Campus - Art Club",
          role: "Observer",
          member_count: 8,
          updates: "Join Now",
        },
      ],
      events: [
        {
          id: 1,
          date: "2025-09-07",
          time: "4:00 PM",
          title: "Practice at Yakkala Field",
          note: "Bring Uniform",
        },
        {
          id: 2,
          date: "2025-09-10",
          time: "4:15 PM",
          title: "Sports Day vs. Rival School",
          note: "Wear Red",
        },
      ],
    },
  ],
};
