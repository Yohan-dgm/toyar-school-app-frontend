import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
  Alert,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CustomSkeleton from "../../ui/CustomSkeleton";
import { theme } from "../../../styles/theme";
import MediaViewer from "../../media/MediaViewer";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const SchoolTab = ({ userCategory, isConnected, filters }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [likedPosts, setLikedPosts] = useState({});

  // Media viewer states - now handled by MediaViewer component

  // Enhanced mock data with different media types and more posts (50+ posts for testing)
  const getAllMockPosts = () => [
    // First batch (10 posts)
    {
      id: 101,
      type: "announcement",
      category: "announcement",
      author: "Principal Johnson",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🎉 Congratulations to our Grade 10 students for their outstanding performance in the Science Fair! Special recognition goes to Team Alpha for their innovative project on renewable energy. #ScienceFair #Achievement #Innovation",
      timestamp: "2 hours ago",
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 24,
      comments: 8,
      isLiked: false,
      media: null,
      hashtags: ["ScienceFair", "Achievement", "Innovation"],
    },
    {
      id: 102,
      type: "event",
      category: "event",
      author: "Student Council",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        '🎭 Annual Drama Club performance "Romeo and Juliet" this Saturday at 7 PM in the school auditorium. Tickets available at the main office. #Drama #Theater #Performance',
      timestamp: "4 hours ago",
      date: new Date(Date.now() - 4 * 60 * 60 * 1000),
      likes: 18,
      comments: 6,
      isLiked: true,
      media: {
        type: "image",
        uri: require("../../../assets/images/sample-profile.png"),
      },
      hashtags: ["Drama", "Theater", "Performance"],
    },
    {
      id: 103,
      type: "sports",
      category: "sports",
      author: "Coach Martinez",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "⚽ Great victory for our school football team! We won 3-1 against Riverside High. Next match is on Friday. Come support our team! #Football #Victory #TeamSpirit",
      timestamp: "1 day ago",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      likes: 45,
      comments: 15,
      isLiked: false,
      media: {
        type: "video",
        uri: require("../../../assets/images/mov_bbb.mov"),
        thumbnail: require("../../../assets/images/sample-profile.png"),
      },
      hashtags: ["Football", "Victory", "TeamSpirit"],
    },
    {
      id: 104,
      type: "academic",
      category: "academic",
      author: "Ms. Sarah Wilson",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "📚 Reminder: Final exams start next Monday. Study schedule and exam halls have been posted on the notice board. Good luck to all students! #Exams #Academic #StudyHard",
      timestamp: "6 hours ago",
      date: new Date(Date.now() - 6 * 60 * 60 * 1000),
      likes: 32,
      comments: 12,
      isLiked: false,
      media: {
        type: "pdf",
        uri: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf", // Using publicly accessible dummy PDF
        fileName: "Exam_Schedule_2024.pdf",
        fileSize: "2.3 MB",
      },
      hashtags: ["Exams", "Academic", "StudyHard"],
    },
    {
      id: 105,
      type: "achievement",
      category: "achievement",
      author: "Vice Principal Davis",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🏆 Proud to announce that our debate team has won the Regional Championship! Congratulations to Emma, Jake, and Lisa for their outstanding performance. #Debate #Championship #Pride",
      timestamp: "3 days ago",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      likes: 67,
      comments: 23,
      isLiked: true,
      media: {
        type: "multiple_images",
        images: [
          require("../../../assets/images/sample-profile.png"),
          require("../../../assets/images/sample-profile.png"),
          require("../../../assets/images/nexis-logo.png"),
        ],
      },
      hashtags: ["Debate", "Championship", "Pride"],
    },
    {
      id: 106,
      type: "news",
      category: "news",
      author: "School Administration",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "📢 New cafeteria menu starting next week! We've added more healthy options based on student feedback. Menu will be available on the school website. #Cafeteria #HealthyEating #StudentFeedback",
      timestamp: "5 hours ago",
      date: new Date(Date.now() - 5 * 60 * 60 * 1000),
      likes: 15,
      comments: 4,
      isLiked: false,
      media: null,
      hashtags: ["Cafeteria", "HealthyEating", "StudentFeedback"],
    },
    {
      id: 107,
      type: "sports",
      category: "sports",
      author: "Coach Thompson",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🏀 Basketball tryouts for the junior team will be held this Thursday at 4 PM in the main gym. Bring your sports gear and water bottle. #Basketball #Tryouts #JuniorTeam",
      timestamp: "8 hours ago",
      date: new Date(Date.now() - 8 * 60 * 60 * 1000),
      likes: 28,
      comments: 9,
      isLiked: false,
      media: {
        type: "image",
        uri: require("../../../assets/images/sample-profile.png"),
      },
      hashtags: ["Basketball", "Tryouts", "JuniorTeam"],
    },
    {
      id: 108,
      type: "event",
      category: "event",
      author: "Art Department",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🎨 Annual Art Exhibition opens tomorrow! Come see the amazing artwork created by our talented students. Exhibition runs from 9 AM to 5 PM in the art gallery. #ArtExhibition #StudentArt #Creativity",
      timestamp: "12 hours ago",
      date: new Date(Date.now() - 12 * 60 * 60 * 1000),
      likes: 41,
      comments: 17,
      isLiked: true,
      media: {
        type: "multiple_images",
        images: [
          require("../../../assets/images/sample-profile.png"),
          require("../../../assets/images/sample-profile.png"),
        ],
      },
      hashtags: ["ArtExhibition", "StudentArt", "Creativity"],
    },
    {
      id: 109,
      type: "academic",
      category: "academic",
      author: "Library Staff",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "📖 New books have arrived in our library! Check out the latest collection of science fiction, history, and educational materials. Library hours: 8 AM - 6 PM. #Library #NewBooks #Reading",
      timestamp: "1 day ago",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      likes: 22,
      comments: 7,
      isLiked: false,
      media: {
        type: "image",
        uri: require("../../../assets/images/nexis-logo.png"),
      },
      hashtags: ["Library", "NewBooks", "Reading"],
    },
    {
      id: 110,
      type: "sports",
      category: "sports",
      author: "Swimming Coach",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🏊‍♀️ Swimming championship results are in! Our team secured 2nd place in the district competition. Special congratulations to Sarah for breaking the school record! #Swimming #Championship #Record",
      timestamp: "2 days ago",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      likes: 56,
      comments: 19,
      isLiked: true,
      media: {
        type: "video",
        uri: require("../../../assets/images/mov_bbb.mov"),
        thumbnail: require("../../../assets/images/sample-profile.png"),
      },
      hashtags: ["Swimming", "Championship", "Record"],
    },
    // Second batch (10 more posts)
    {
      id: 111,
      type: "announcement",
      category: "announcement",
      author: "IT Department",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "💻 School WiFi maintenance scheduled for this weekend. Internet services will be temporarily unavailable on Saturday from 2 PM to 6 PM. #IT #Maintenance #WiFi",
      timestamp: "3 hours ago",
      date: new Date(Date.now() - 3 * 60 * 60 * 1000),
      likes: 12,
      comments: 3,
      isLiked: false,
      media: null,
      hashtags: ["IT", "Maintenance", "WiFi"],
    },
    {
      id: 112,
      type: "event",
      category: "event",
      author: "Music Department",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🎵 Join us for the Spring Concert next Friday! Our talented students will perform classical and contemporary pieces. Doors open at 6:30 PM. #Music #Concert #Performance",
      timestamp: "7 hours ago",
      date: new Date(Date.now() - 7 * 60 * 60 * 1000),
      likes: 34,
      comments: 11,
      isLiked: true,
      media: {
        type: "pdf",
        uri: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf", // Using publicly accessible dummy PDF
        fileName: "Spring_Concert_Program.pdf",
        fileSize: "1.8 MB",
      },
      hashtags: ["Music", "Concert", "Performance"],
    },
    {
      id: 113,
      type: "academic",
      category: "academic",
      author: "Science Department",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🔬 Exciting news! Our chemistry lab has been upgraded with new equipment. Students can now conduct more advanced experiments. Safety training starts Monday. #Science #Lab #Chemistry",
      timestamp: "10 hours ago",
      date: new Date(Date.now() - 10 * 60 * 60 * 1000),
      likes: 29,
      comments: 8,
      isLiked: false,
      media: {
        type: "multiple_images",
        images: [
          require("../../../assets/images/sample-profile.png"),
          require("../../../assets/images/sample-profile.png"),
          require("../../../assets/images/nexis-logo.png"),
          require("../../../assets/images/sample-profile.png"),
        ],
      },
      hashtags: ["Science", "Lab", "Chemistry"],
    },
    {
      id: 114,
      type: "sports",
      category: "sports",
      author: "Tennis Coach",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🎾 Tennis team practice schedule updated! New timings: Monday & Wednesday 4-6 PM, Friday 3-5 PM. Don't forget to bring your rackets and water bottles. #Tennis #Practice #Schedule",
      timestamp: "1 day ago",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      likes: 18,
      comments: 5,
      isLiked: false,
      media: {
        type: "image",
        uri: require("../../../assets/images/sample-profile.png"),
      },
      hashtags: ["Tennis", "Practice", "Schedule"],
    },
    {
      id: 115,
      type: "achievement",
      category: "achievement",
      author: "Math Department",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🏅 Congratulations to our Math Olympiad team! They secured 1st place in the regional competition. Special mention to Alex, Maria, and David for their exceptional performance. #Math #Olympiad #Achievement",
      timestamp: "2 days ago",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      likes: 78,
      comments: 25,
      isLiked: true,
      media: {
        type: "video",
        uri: require("../../../assets/images/mov_bbb.mov"),
        thumbnail: require("../../../assets/images/sample-profile.png"),
      },
      hashtags: ["Math", "Olympiad", "Achievement"],
    },
    {
      id: 116,
      type: "news",
      category: "news",
      author: "Health Department",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🏥 Annual health checkup for all students starts next week. Please bring your health cards and vaccination records. Schedule available at the nurse's office. #Health #Checkup #Vaccination",
      timestamp: "14 hours ago",
      date: new Date(Date.now() - 14 * 60 * 60 * 1000),
      likes: 25,
      comments: 6,
      isLiked: false,
      media: {
        type: "pdf",
        uri: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf", // Using publicly accessible dummy PDF
        fileName: "Health_Checkup_Guidelines.pdf",
        fileSize: "950 KB",
      },
      hashtags: ["Health", "Checkup", "Vaccination"],
    },
    {
      id: 117,
      type: "event",
      category: "event",
      author: "Drama Club",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🎭 Auditions for the winter play 'A Christmas Carol' are open! Sign up at the drama room. Auditions will be held next Tuesday and Wednesday after school. #Drama #Auditions #ChristmasCarol",
      timestamp: "18 hours ago",
      date: new Date(Date.now() - 18 * 60 * 60 * 1000),
      likes: 31,
      comments: 14,
      isLiked: true,
      media: {
        type: "image",
        uri: require("../../../assets/images/sample-profile.png"),
      },
      hashtags: ["Drama", "Auditions", "ChristmasCarol"],
    },
    {
      id: 118,
      type: "academic",
      category: "academic",
      author: "English Department",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "📝 Creative writing competition entries are now being accepted! Theme: 'Future Innovations'. Deadline: End of this month. Prizes for top 3 entries! #Writing #Competition #Creativity",
      timestamp: "1 day ago",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      likes: 42,
      comments: 16,
      isLiked: false,
      media: {
        type: "multiple_images",
        images: [
          require("../../../assets/images/nexis-logo.png"),
          require("../../../assets/images/sample-profile.png"),
        ],
      },
      hashtags: ["Writing", "Competition", "Creativity"],
    },
    {
      id: 119,
      type: "sports",
      category: "sports",
      author: "Track Coach",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🏃‍♂️ Track and field season is starting! Training begins Monday at 3:30 PM. All skill levels welcome. Let's aim for the state championships this year! #Track #Training #Championships",
      timestamp: "3 days ago",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      likes: 38,
      comments: 12,
      isLiked: true,
      media: {
        type: "video",
        uri: require("../../../assets/images/mov_bbb.mov"),
        thumbnail: require("../../../assets/images/sample-profile.png"),
      },
      hashtags: ["Track", "Training", "Championships"],
    },
    {
      id: 120,
      type: "announcement",
      category: "announcement",
      author: "Security Office",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🔒 New security protocols in effect. All visitors must register at the main office. Student ID cards are required for campus access. #Security #Protocol #Safety",
      timestamp: "4 days ago",
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      likes: 19,
      comments: 4,
      isLiked: false,
      media: null,
      hashtags: ["Security", "Protocol", "Safety"],
    },
    // Third batch (10 more posts)
    {
      id: 121,
      type: "academic",
      category: "academic",
      author: "History Department",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "📚 Exciting field trip to the National Museum next week! Students will explore ancient civilizations and historical artifacts. Permission slips due Friday. #History #FieldTrip #Museum",
      timestamp: "5 days ago",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      likes: 33,
      comments: 9,
      isLiked: false,
      media: {
        type: "multiple_images",
        images: [
          require("../../../assets/images/sample-profile.png"),
          require("../../../assets/images/sample-profile.png"),
          require("../../../assets/images/nexis-logo.png"),
        ],
      },
      hashtags: ["History", "FieldTrip", "Museum"],
    },
    {
      id: 122,
      type: "sports",
      category: "sports",
      author: "Volleyball Coach",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🏐 Volleyball team tryouts start tomorrow! Open to all grade levels. Practice gear required. Show your team spirit and join us! #Volleyball #Tryouts #TeamSpirit",
      timestamp: "6 hours ago",
      date: new Date(Date.now() - 6 * 60 * 60 * 1000),
      likes: 27,
      comments: 11,
      isLiked: true,
      media: {
        type: "image",
        uri: require("../../../assets/images/sample-profile.png"),
      },
      hashtags: ["Volleyball", "Tryouts", "TeamSpirit"],
    },
    {
      id: 123,
      type: "event",
      category: "event",
      author: "Science Club",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🔬 Science Club meeting this Thursday! We'll be discussing our upcoming robotics competition. New members welcome. Meet in Lab 3 at 3:30 PM. #Science #Robotics #Club",
      timestamp: "9 hours ago",
      date: new Date(Date.now() - 9 * 60 * 60 * 1000),
      likes: 21,
      comments: 7,
      isLiked: false,
      media: {
        type: "pdf",
        uri: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
        fileName: "Robotics_Competition_Rules.pdf",
        fileSize: "1.2 MB",
      },
      hashtags: ["Science", "Robotics", "Club"],
    },
    {
      id: 124,
      type: "achievement",
      category: "achievement",
      author: "Art Teacher",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🎨 Amazing news! Our student Maya's artwork has been selected for the State Art Competition! Her painting 'Dreams of Tomorrow' will represent our school. #Art #Competition #Achievement",
      timestamp: "2 days ago",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      likes: 89,
      comments: 32,
      isLiked: true,
      media: {
        type: "image",
        uri: require("../../../assets/images/sample-profile.png"),
      },
      hashtags: ["Art", "Competition", "Achievement"],
    },
    {
      id: 125,
      type: "announcement",
      category: "announcement",
      author: "Cafeteria Manager",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🍎 New healthy lunch options available starting Monday! Fresh salads, whole grain options, and organic fruits. Check out the updated menu on our website. #HealthyEating #Lunch #Nutrition",
      timestamp: "1 day ago",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      likes: 16,
      comments: 4,
      isLiked: false,
      media: null,
      hashtags: ["HealthyEating", "Lunch", "Nutrition"],
    },
    {
      id: 126,
      type: "sports",
      category: "sports",
      author: "Baseball Coach",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "⚾ Baseball season is here! First game against Central High this Saturday at 2 PM. Come cheer for our Eagles! Concessions will be available. #Baseball #Game #Eagles",
      timestamp: "3 days ago",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      likes: 52,
      comments: 18,
      isLiked: true,
      media: {
        type: "video",
        uri: require("../../../assets/images/mov_bbb.mov"),
        thumbnail: require("../../../assets/images/sample-profile.png"),
      },
      hashtags: ["Baseball", "Game", "Eagles"],
    },
    {
      id: 127,
      type: "academic",
      category: "academic",
      author: "Computer Science Teacher",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "💻 Coding bootcamp registration is now open! Learn Python, JavaScript, and web development. Sessions start next month. Limited spots available! #Coding #Programming #Technology",
      timestamp: "4 days ago",
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      likes: 44,
      comments: 15,
      isLiked: false,
      media: {
        type: "multiple_images",
        images: [
          require("../../../assets/images/sample-profile.png"),
          require("../../../assets/images/nexis-logo.png"),
        ],
      },
      hashtags: ["Coding", "Programming", "Technology"],
    },
    {
      id: 128,
      type: "event",
      category: "event",
      author: "Student Government",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🗳️ Student Council elections next week! Candidate speeches will be held in the auditorium on Tuesday. Make your voice heard and vote! #Elections #StudentCouncil #Democracy",
      timestamp: "11 hours ago",
      date: new Date(Date.now() - 11 * 60 * 60 * 1000),
      likes: 38,
      comments: 13,
      isLiked: true,
      media: {
        type: "pdf",
        uri: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
        fileName: "Election_Guidelines.pdf",
        fileSize: "800 KB",
      },
      hashtags: ["Elections", "StudentCouncil", "Democracy"],
    },
    {
      id: 129,
      type: "news",
      category: "news",
      author: "Maintenance Department",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🔧 Playground equipment maintenance scheduled for this weekend. The playground will be closed Saturday and Sunday. Thank you for your patience! #Maintenance #Playground #Safety",
      timestamp: "13 hours ago",
      date: new Date(Date.now() - 13 * 60 * 60 * 1000),
      likes: 8,
      comments: 2,
      isLiked: false,
      media: null,
      hashtags: ["Maintenance", "Playground", "Safety"],
    },
    {
      id: 130,
      type: "achievement",
      category: "achievement",
      author: "Band Director",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🎺 Our school band earned first place at the Regional Music Festival! Congratulations to all our talented musicians. Concert performance next Friday! #Band #Music #Achievement",
      timestamp: "5 days ago",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      likes: 76,
      comments: 28,
      isLiked: true,
      media: {
        type: "video",
        uri: require("../../../assets/images/mov_bbb.mov"),
        thumbnail: require("../../../assets/images/sample-profile.png"),
      },
      hashtags: ["Band", "Music", "Achievement"],
    },
    // Fourth batch (10 more posts)
    {
      id: 131,
      type: "event",
      category: "event",
      author: "Photography Club",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "📸 Photography workshop this weekend! Learn about composition, lighting, and editing techniques. Bring your cameras or smartphones. Registration required! #Photography #Workshop #Art",
      timestamp: "6 days ago",
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      likes: 35,
      comments: 12,
      isLiked: false,
      media: {
        type: "multiple_images",
        images: [
          require("../../../assets/images/sample-profile.png"),
          require("../../../assets/images/sample-profile.png"),
          require("../../../assets/images/nexis-logo.png"),
          require("../../../assets/images/sample-profile.png"),
        ],
      },
      hashtags: ["Photography", "Workshop", "Art"],
    },
    {
      id: 132,
      type: "academic",
      category: "academic",
      author: "Physics Teacher",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "⚡ Exciting physics demonstration tomorrow! We'll be exploring electricity and magnetism with hands-on experiments. Don't miss this electrifying class! #Physics #Science #Experiments",
      timestamp: "15 hours ago",
      date: new Date(Date.now() - 15 * 60 * 60 * 1000),
      likes: 29,
      comments: 8,
      isLiked: true,
      media: {
        type: "video",
        uri: require("../../../assets/images/mov_bbb.mov"),
        thumbnail: require("../../../assets/images/sample-profile.png"),
      },
      hashtags: ["Physics", "Science", "Experiments"],
    },
    {
      id: 133,
      type: "sports",
      category: "sports",
      author: "Soccer Coach",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "⚽ Soccer team practice moved to indoor gym due to weather. Same time, different location. Bring indoor shoes and water bottles. See you there! #Soccer #Practice #Weather",
      timestamp: "17 hours ago",
      date: new Date(Date.now() - 17 * 60 * 60 * 1000),
      likes: 22,
      comments: 6,
      isLiked: false,
      media: null,
      hashtags: ["Soccer", "Practice", "Weather"],
    },
    {
      id: 134,
      type: "announcement",
      category: "announcement",
      author: "School Nurse",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🏥 Flu vaccination clinic next Tuesday! Free vaccines for all students and staff. Consent forms available at the main office. Stay healthy! #Health #Vaccination #Flu",
      timestamp: "7 days ago",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      likes: 18,
      comments: 5,
      isLiked: false,
      media: {
        type: "pdf",
        uri: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
        fileName: "Vaccination_Consent_Form.pdf",
        fileSize: "650 KB",
      },
      hashtags: ["Health", "Vaccination", "Flu"],
    },
    {
      id: 135,
      type: "achievement",
      category: "achievement",
      author: "Chess Club Advisor",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "♟️ Congratulations to our chess team! They won the District Championship and will advance to the state tournament. Strategic thinking pays off! #Chess #Championship #Strategy",
      timestamp: "8 days ago",
      date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      likes: 64,
      comments: 21,
      isLiked: true,
      media: {
        type: "image",
        uri: require("../../../assets/images/sample-profile.png"),
      },
      hashtags: ["Chess", "Championship", "Strategy"],
    },
    {
      id: 136,
      type: "event",
      category: "event",
      author: "Environmental Club",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🌱 Earth Day cleanup event this Saturday! Join us in making our school and community greener. Gloves and bags provided. Let's make a difference! #EarthDay #Environment #Community",
      timestamp: "19 hours ago",
      date: new Date(Date.now() - 19 * 60 * 60 * 1000),
      likes: 47,
      comments: 16,
      isLiked: true,
      media: {
        type: "multiple_images",
        images: [
          require("../../../assets/images/nexis-logo.png"),
          require("../../../assets/images/sample-profile.png"),
        ],
      },
      hashtags: ["EarthDay", "Environment", "Community"],
    },
    {
      id: 137,
      type: "academic",
      category: "academic",
      author: "Biology Teacher",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🔬 Microscopy lab session tomorrow! Students will examine plant and animal cells. This hands-on experience will enhance your understanding of cellular biology. #Biology #Lab #Cells",
      timestamp: "1 week ago",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      likes: 31,
      comments: 9,
      isLiked: false,
      media: {
        type: "pdf",
        uri: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
        fileName: "Cell_Biology_Lab_Guide.pdf",
        fileSize: "1.5 MB",
      },
      hashtags: ["Biology", "Lab", "Cells"],
    },
    {
      id: 138,
      type: "sports",
      category: "sports",
      author: "Track Coach",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🏃‍♀️ Track meet results are in! Our relay team set a new school record. Individual achievements will be recognized at Monday's assembly. Great job everyone! #Track #Record #Achievement",
      timestamp: "9 days ago",
      date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      likes: 58,
      comments: 22,
      isLiked: true,
      media: {
        type: "video",
        uri: require("../../../assets/images/mov_bbb.mov"),
        thumbnail: require("../../../assets/images/sample-profile.png"),
      },
      hashtags: ["Track", "Record", "Achievement"],
    },
    {
      id: 139,
      type: "news",
      category: "news",
      author: "Transportation Department",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🚌 Bus route changes effective next Monday due to road construction. Updated schedules available on the school website. Please check your route! #Transportation #BusRoute #Schedule",
      timestamp: "21 hours ago",
      date: new Date(Date.now() - 21 * 60 * 60 * 1000),
      likes: 14,
      comments: 7,
      isLiked: false,
      media: null,
      hashtags: ["Transportation", "BusRoute", "Schedule"],
    },
    {
      id: 140,
      type: "event",
      category: "event",
      author: "Yearbook Committee",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "📚 Yearbook photo retakes next Wednesday! If you missed picture day or want a retake, this is your chance. Sign up at the main office by Monday. #Yearbook #Photos #Retakes",
      timestamp: "10 days ago",
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      likes: 26,
      comments: 11,
      isLiked: false,
      media: {
        type: "image",
        uri: require("../../../assets/images/sample-profile.png"),
      },
      hashtags: ["Yearbook", "Photos", "Retakes"],
    },
    // Fifth batch (10 more posts) - Total 50 posts
    {
      id: 141,
      type: "academic",
      category: "academic",
      author: "Chemistry Teacher",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "⚗️ Amazing chemistry lab results from yesterday's experiment! Students successfully synthesized aspirin and learned about organic chemistry. Science is fascinating! #Chemistry #Lab #Synthesis",
      timestamp: "11 days ago",
      date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
      likes: 42,
      comments: 14,
      isLiked: true,
      media: {
        type: "multiple_images",
        images: [
          require("../../../assets/images/sample-profile.png"),
          require("../../../assets/images/sample-profile.png"),
        ],
      },
      hashtags: ["Chemistry", "Lab", "Synthesis"],
    },
    {
      id: 142,
      type: "sports",
      category: "sports",
      author: "Gymnastics Coach",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🤸‍♀️ Gymnastics team tryouts next week! All skill levels welcome. We'll teach you the basics and help you improve. Join us for an amazing journey! #Gymnastics #Tryouts #Skills",
      timestamp: "23 hours ago",
      date: new Date(Date.now() - 23 * 60 * 60 * 1000),
      likes: 33,
      comments: 10,
      isLiked: false,
      media: {
        type: "video",
        uri: require("../../../assets/images/mov_bbb.mov"),
        thumbnail: require("../../../assets/images/sample-profile.png"),
      },
      hashtags: ["Gymnastics", "Tryouts", "Skills"],
    },
    {
      id: 143,
      type: "event",
      category: "event",
      author: "Debate Club",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🗣️ Debate tournament this Friday! Topic: 'Technology in Education: Benefit or Distraction?' Come watch our students showcase their argumentative skills! #Debate #Tournament #Education",
      timestamp: "12 days ago",
      date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      likes: 39,
      comments: 17,
      isLiked: true,
      media: {
        type: "pdf",
        uri: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
        fileName: "Debate_Tournament_Rules.pdf",
        fileSize: "1.1 MB",
      },
      hashtags: ["Debate", "Tournament", "Education"],
    },
    {
      id: 144,
      type: "achievement",
      category: "achievement",
      author: "Robotics Team",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🤖 Our robotics team won the Regional Championship! Their innovative design and programming skills impressed all judges. Next stop: State Championship! #Robotics #Championship #Innovation",
      timestamp: "13 days ago",
      date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
      likes: 95,
      comments: 34,
      isLiked: true,
      media: {
        type: "video",
        uri: require("../../../assets/images/mov_bbb.mov"),
        thumbnail: require("../../../assets/images/sample-profile.png"),
      },
      hashtags: ["Robotics", "Championship", "Innovation"],
    },
    {
      id: 145,
      type: "announcement",
      category: "announcement",
      author: "Parent-Teacher Association",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "👨‍👩‍👧‍👦 PTA meeting next Thursday at 7 PM in the school auditorium. We'll discuss upcoming events and fundraising activities. Your participation matters! #PTA #Meeting #Community",
      timestamp: "1 day ago",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      likes: 21,
      comments: 8,
      isLiked: false,
      media: null,
      hashtags: ["PTA", "Meeting", "Community"],
    },
    {
      id: 146,
      type: "academic",
      category: "academic",
      author: "Geography Teacher",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🌍 Virtual field trip to the Amazon Rainforest tomorrow! Using VR technology, students will explore biodiversity and learn about conservation. The future of education! #Geography #VR #Amazon",
      timestamp: "25 hours ago",
      date: new Date(Date.now() - 25 * 60 * 60 * 1000),
      likes: 48,
      comments: 19,
      isLiked: true,
      media: {
        type: "image",
        uri: require("../../../assets/images/sample-profile.png"),
      },
      hashtags: ["Geography", "VR", "Amazon"],
    },
    {
      id: 147,
      type: "sports",
      category: "sports",
      author: "Wrestling Coach",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🤼‍♂️ Wrestling season begins! Training starts Monday after school. Learn discipline, strength, and technique. All weight classes welcome. Join the wrestling family! #Wrestling #Training #Discipline",
      timestamp: "14 days ago",
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      likes: 28,
      comments: 9,
      isLiked: false,
      media: {
        type: "multiple_images",
        images: [
          require("../../../assets/images/sample-profile.png"),
          require("../../../assets/images/sample-profile.png"),
          require("../../../assets/images/nexis-logo.png"),
        ],
      },
      hashtags: ["Wrestling", "Training", "Discipline"],
    },
    {
      id: 148,
      type: "event",
      category: "event",
      author: "Cultural Committee",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🎪 International Culture Festival next month! Students will showcase traditions, food, and performances from around the world. Celebrate diversity! #Culture #Festival #Diversity",
      timestamp: "15 days ago",
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      likes: 67,
      comments: 26,
      isLiked: true,
      media: {
        type: "multiple_images",
        images: [
          require("../../../assets/images/sample-profile.png"),
          require("../../../assets/images/nexis-logo.png"),
          require("../../../assets/images/sample-profile.png"),
          require("../../../assets/images/sample-profile.png"),
        ],
      },
      hashtags: ["Culture", "Festival", "Diversity"],
    },
    {
      id: 149,
      type: "news",
      category: "news",
      author: "Technology Department",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "💻 New computer lab officially open! 30 new computers with latest software for coding, design, and research. Students can now access cutting-edge technology! #Technology #ComputerLab #Innovation",
      timestamp: "16 days ago",
      date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
      likes: 54,
      comments: 18,
      isLiked: false,
      media: {
        type: "image",
        uri: require("../../../assets/images/nexis-logo.png"),
      },
      hashtags: ["Technology", "ComputerLab", "Innovation"],
    },
    {
      id: 150,
      type: "achievement",
      category: "achievement",
      author: "Principal Johnson",
      authorImage: require("../../../assets/images/sample-profile.png"),
      content:
        "🏆 Proud to announce our school has been recognized as 'School of Excellence' for the third consecutive year! This achievement reflects our commitment to quality education. #Excellence #Achievement #Pride",
      timestamp: "17 days ago",
      date: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
      likes: 156,
      comments: 47,
      isLiked: true,
      media: {
        type: "video",
        uri: require("../../../assets/images/mov_bbb.mov"),
        thumbnail: require("../../../assets/images/sample-profile.png"),
      },
      hashtags: ["Excellence", "Achievement", "Pride"],
    },
  ];

  const [allPosts] = useState(getAllMockPosts());
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  // Filter posts based on current filters
  useEffect(() => {
    applyFilters();
  }, [displayedPosts, filters]);

  const applyFilters = () => {
    let filtered = [...displayedPosts];

    // Search term filter
    if (filters?.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.content.toLowerCase().includes(searchLower) ||
          post.author.toLowerCase().includes(searchLower) ||
          post.hashtags.some((tag) => tag.toLowerCase().includes(searchLower))
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
            postTag.toLowerCase().includes(filterTag.toLowerCase())
          )
        )
      );
    }

    setFilteredPosts(filtered);
  };

  const loadPosts = async (isRefresh = false, isAutoLoad = false) => {
    if (!isConnected) {
      Alert.alert("No Internet", "Please check your connection");
      return;
    }

    // Prevent multiple simultaneous loads
    if (isAutoLoad && (loading || loadingMore)) {
      return;
    }

    try {
      if (isRefresh) {
        setLoading(true);
      } else if (isAutoLoad) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const postsPerPage = 10;
      const currentPage = isRefresh ? 1 : page;
      const startIndex = isRefresh ? 0 : (currentPage - 1) * postsPerPage;
      const endIndex = startIndex + postsPerPage;
      const newPosts = allPosts.slice(startIndex, endIndex);

      if (isRefresh) {
        setDisplayedPosts(newPosts);
        setPage(2); // Next page will be 2
        setHasMore(allPosts.length > postsPerPage);
      } else {
        setDisplayedPosts((prev) => [...prev, ...newPosts]);
        setPage((prev) => prev + 1);
        setHasMore(endIndex < allPosts.length);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load posts");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadPosts(true);
  };

  const handleEndReached = () => {
    // Auto-load when user scrolls to bottom
    if (hasMore && !loading && !loadingMore) {
      loadPosts(false, true);
    }
  };

  const handleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Media handlers - now handled by MediaViewer component

  // Media viewer components - now handled by MediaViewer component

  const renderPost = (post) => (
    <View style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <Image source={post.authorImage} style={styles.authorImage} />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{post.author}</Text>
          <Text style={styles.timestamp}>{post.timestamp}</Text>
        </View>
      </View>

      {/* Post Content */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Post Media */}
      {post.media && (
        <View style={styles.mediaContainer}>
          <MediaViewer
            media={post.media}
            showControls={true}
            autoPlay={false}
            onPress={(media, type) => {
              console.log(`📱 Media pressed: ${type}`, media);
            }}
          />
        </View>
      )}

      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLike(post.id)}
        >
          <Icon
            name={
              likedPosts[post.id] || post.isLiked
                ? "favorite"
                : "favorite-border"
            }
            size={20}
            color={likedPosts[post.id] || post.isLiked ? "#3b5998" : "#65676B"}
          />
          <Text
            style={[
              styles.actionText,
              (likedPosts[post.id] || post.isLiked) && styles.actionTextActive,
            ]}
          >
            {post.likes +
              (likedPosts[post.id] && !post.isLiked
                ? 1
                : !likedPosts[post.id] && post.isLiked
                  ? -1
                  : 0)}
          </Text>
        </TouchableOpacity>

        {/* Comment option hidden for now */}
        {/*
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="comment" size={20} color="#65676B" />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
        */}
      </View>
    </View>
  );

  const renderSkeleton = () => (
    <CustomSkeleton
      containerStyle={styles.skeletonContainer}
      layout={[
        { key: "header", width: "100%", height: 60, marginBottom: 10 },
        { key: "content", width: "100%", height: 80, marginBottom: 10 },
        { key: "actions", width: "50%", height: 30 },
      ]}
    />
  );

  if (loading && posts.length === 0) {
    return (
      <View style={styles.container}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.postCard}>
            {renderSkeleton()}
          </View>
        ))}
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>School Feed</Text>
      <Text style={styles.headerSubtitle}>
        Latest school announcements and updates
      </Text>
      {filteredPosts.length !== displayedPosts.length && (
        <Text style={styles.filterInfo}>
          Showing {filteredPosts.length} of {displayedPosts.length} posts
        </Text>
      )}
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.noResultsContainer}>
      <Icon name="search-off" size={48} color="#8E8E93" />
      <Text style={styles.noResultsTitle}>No posts found</Text>
      <Text style={styles.noResultsText}>
        Try adjusting your filters or search terms
      </Text>
    </View>
  );

  const renderFooter = () => (
    <>
      {/* Loading Icon for Auto-Load */}
      {(loading || loadingMore) && displayedPosts.length > 0 && (
        <View style={styles.loadingMoreContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingMoreText}>Loading more posts...</Text>
        </View>
      )}

      {/* End of posts indicator */}
      {!hasMore && displayedPosts.length > 0 && (
        <View style={styles.endOfPostsContainer}>
          <Icon name="check-circle" size={24} color="#4CAF50" />
          <Text style={styles.endOfPostsText}>You've reached the end!</Text>
        </View>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => `school-tab-post-${item.id}`}
        renderItem={({ item }) => renderPost(item)}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          displayedPosts.length > 0 ? renderEmptyComponent : null
        }
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      />

      {/* Media Modals - now handled by MediaViewer component */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#8E8E93",
  },
  postCard: {
    backgroundColor: "#FFFFFF",
    marginVertical: 4,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: "#8E8E93",
  },
  postContent: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },

  // Media Styles
  mediaContainer: {
    marginBottom: theme.spacing.sm,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    resizeMode: "cover",
  },

  // Multiple Images
  multipleImagesContainer: {
    marginBottom: theme.spacing.sm,
  },
  multipleImageWrapper: {
    position: "relative",
    marginRight: 8,
  },
  multipleImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    resizeMode: "cover",
  },
  imageCountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  imageCountText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  // Video Styles
  videoWrapper: {
    position: "relative",
  },
  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 8,
  },

  // PDF Styles
  pdfWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  pdfIcon: {
    marginRight: theme.spacing.md,
  },
  pdfInfo: {
    flex: 1,
  },
  pdfFileName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 2,
  },
  pdfFileSize: {
    fontSize: 12,
    color: "#8E8E93",
  },

  // Loading More Indicator
  loadingMoreContainer: {
    padding: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingMoreText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "500",
    marginTop: 8,
  },

  postActions: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: theme.spacing.lg,
  },
  actionText: {
    fontSize: 14,
    color: "#65676B",
    fontWeight: "500",
    marginLeft: 4,
  },
  actionTextActive: {
    color: "#3b5998",
  },
  skeletonContainer: {
    padding: theme.spacing.md,
  },
  // End of Posts Indicator
  endOfPostsContainer: {
    padding: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  endOfPostsText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
    marginLeft: 8,
  },
  filterInfo: {
    fontSize: 12,
    color: "#3b5998",
    fontWeight: "500",
    marginTop: 4,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8E8E93",
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 20,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1000,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },

  // Image Modal
  imageContainer: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: screenWidth - 40,
    height: screenHeight - 200,
    resizeMode: "contain",
  },
  imageCounter: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: "600",
  },

  // Video Modal
  videoContainer: {
    width: screenWidth - 40,
    height: (screenWidth - 40) * 0.6, // 16:10 aspect ratio for better video viewing
    backgroundColor: "#000000",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  fullScreenVideo: {
    width: screenWidth - 40,
    height: (screenWidth - 40) * 0.6,
    borderRadius: 12,
  },
  videoPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  videoText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  videoSubtext: {
    color: "#CCCCCC",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },

  // PDF Modal
  pdfContainer: {
    width: screenWidth - 40,
    height: screenHeight - 200,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
  },
  pdfHeader: {
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  pdfTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: 12,
    textAlign: "center",
  },
  pdfSize: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },
  pdfViewerContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  pdfWebView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  pdfLoadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  pdfLoadingText: {
    fontSize: 16,
    color: "#8E8E93",
    marginTop: 12,
    textAlign: "center",
  },
});

export default SchoolTab;
