import React from "react";
import { Image, Text } from "react-native";
import { View } from "react-native";
import { Menu } from "@/lib/icons/Menu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export default function HeaderUnauthenticated() {
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
          <Avatar alt="" className="w-[48px] h-[48px]">
            <AvatarImage source={require("@/assets/icon.png")} />
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
            <AvatarImage source={require("@/assets/icon.png")} />
            <AvatarFallback>
              <Text>N</Text>
            </AvatarFallback>
          </Avatar>
          <Text className="text-[#fff]">Sasindinima</Text>
        </View>
      </View>
    </View>
  );
}
