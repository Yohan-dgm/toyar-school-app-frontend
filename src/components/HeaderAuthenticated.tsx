import React from "react";
import { Image, Text, View } from "react-native";

import { Menu } from "@/lib/icons/Menu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import {
  getStudentProfilePicture,
  getDefaultStudentProfileImage,
  getLocalFallbackProfileImage,
} from "../utils/studentProfileUtils";
export default function HeaderAuthenticated() {
  // Get global state
  const { sessionData, selectedStudent } = useSelector(
    (state: any) => state.app,
  );

  // Get profile picture for the selected student
  const profilePictureSource = selectedStudent
    ? getStudentProfilePicture(selectedStudent)
    : null;

  // Fallback to default image if no profile picture
  const profileImage = profilePictureSource || getDefaultStudentProfileImage();

  // If still no profile image, use local fallback
  const finalProfileImage = profileImage || getLocalFallbackProfileImage();

  // Debug log
  console.log("🖼️ HeaderAuthenticated - Profile picture:", {
    selectedStudent: selectedStudent?.id,
    selectedStudentName: selectedStudent?.student_calling_name,
    profilePictureSource,
    profileImage,
    finalProfileImage,
    hasSelectedStudent: !!selectedStudent,
    selectedStudentKeys: selectedStudent ? Object.keys(selectedStudent) : [],
  });

  return (
    <View className="flex flex-col w-full pt-[8px] bg-[#2569CF]">
      {/*  */}
      <View className="flex flex-row w-full justify-end items-center px-[16px]">
        <Text className="text-[#fff] opacity-[0.75]">Parent Account</Text>
      </View>
      {/*  */}
      <View className="flex flex-row w-full justify-between items-center px-[16px]">
        <View>
          <Menu
            className="opacity-[0.75]"
            size={32}
            color="#fff"
            onTouchStart={() => {
              console.log("Menu Open");
            }}
          />
        </View>

        <View className="min-w-[164px] h-[48px]">
          <Image
            source={require("@/assets/images/nexis-logo.png")}
            className="w-[164px] h-[48px]"
            resizeMethod="resize"
            resizeMode="contain"
          />
        </View>
        <View className="flex flex-row justify-end">
          <ThemeToggle />

          {/* Test with regular Image component */}
          <View className="w-[48px] h-[48px] rounded-full overflow-hidden mr-2">
            <Image
              source={finalProfileImage}
              style={{ width: 48, height: 48 }}
              onError={(e) => {
                console.log("🖼️ Test Image Error:", e.nativeEvent);
              }}
              onLoad={() => console.log("🖼️ Test Image Loaded Successfully")}
              resizeMode="cover"
            />
          </View>

          <Avatar alt="" className="w-[48px] h-[48px]">
            <AvatarImage
              source={finalProfileImage}
              onError={(e) => {
                console.log("🖼️ Avatar Image Error:", e.nativeEvent);
                // Try local fallback on error
                return getLocalFallbackProfileImage();
              }}
              onLoad={() => console.log("🖼️ Avatar Image Loaded Successfully")}
            />
            <AvatarFallback>
              <Text>N</Text>
            </AvatarFallback>
          </Avatar>
        </View>
      </View>
      {/*  */}
      <View className="flex flex-row justify-between items-center w-full h-[48px] bg-[rgba(255,255,255,0.15)] mt-[8px] py-[8px] px-[16px]">
        <Text className="text-[rgba(255,255,255,0.45)] text-[12px] max-w-[50%]">
          Nexis College International - Yakkala
        </Text>
        <View className="gap-[8px] flex flex-row justify-end items-center bg-[rgba(0,0,0,0.05)] rounded-[18px] h-[36px] pr-[8px] border-solid border-[rgba(255,255,255,0.25)] border-[1px]">
          <Avatar alt="" className="w-[32px] h-[32px]">
            <AvatarImage source={profileImage} />
            <AvatarFallback>
              <Text>N</Text>
            </AvatarFallback>
          </Avatar>
          <Text className="text-[#fff]">
            {selectedStudent?.student_calling_name || "Student"}
          </Text>
        </View>
      </View>
    </View>
  );
}
