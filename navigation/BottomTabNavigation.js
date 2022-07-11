import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Home from "../asset/icon/icon_home.svg";
import HomeOff from "../asset/icon/icon_home_off.svg";
import Calendar from "../asset/icon/icon_calendar.svg";
import CalendarOff from "../asset/icon/icon_calendar_off.svg";
import Library from "../asset/icon/icon_library.svg";
import LibraryOff from "../asset/icon/icon_library_off.svg";
import MyPage from "../asset/icon/icon_my_page.svg";
import MyPageOff from "../asset/icon/icon_my_page_off.svg";
import HomeScreen from "../screen/HomeScreen";
import CalendarScreen from "../screen/CalendarScreen";
import LibraryScreen from "../screen/LibraryScreen";
import MyPageScreen from "../screen/MyPageScreen";


const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName='CalendarScreen'
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#111111',
      }}
    >
      <Tab.Screen name="HomeScreen"
                  component={HomeScreen}
                  options={{
                    tabBarLabel: 'HOME',
                    tabBarIcon: ({focused}) => {
                      return focused === true ? <Home/> : <HomeOff/>
                    },
                  }}
      />
      <Tab.Screen name="CalendarScreen"
                  component={CalendarScreen}
                  options={{
                    tabBarLabel: 'CALENDAR',
                    tabBarIcon: ({focused}) => {
                      return focused === true ? <Calendar/> : <CalendarOff/>
                    },
                  }}
      />
      <Tab.Screen name="LibraryScreen"
                  component={LibraryScreen}
                  options={{
                    tabBarLabel: 'LIBRARY',
                    tabBarIcon: ({focused}) => {
                      return focused === true ? <Library/> : <LibraryOff/>
                    },
                  }}
      />
      <Tab.Screen name="MyPageScreen"
                  component={MyPageScreen}
                  options={{
                    tabBarLabel: 'MY PAGE',
                    tabBarIcon: ({focused}) => {
                      return focused === true ? <MyPage/> : <MyPageOff/>
                    },
                  }}
      />
    </Tab.Navigator>
  )
}

export default BottomTabNavigation;
