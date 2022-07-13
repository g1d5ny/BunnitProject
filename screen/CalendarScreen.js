import React, { useEffect, useRef, useState } from "react";
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { addDays, format, addMonths, getDate, getMonth, getWeeksInMonth, getYear, startOfMonth, startOfWeek } from "date-fns";
import { screenHeight, screenWidth } from "../style/DimenStyle";
import ArrowLeft from "../asset/icon/icon_arrow_left.svg";
import ArrowRight from "../asset/icon/icon_arrow_right.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";


const CalendarScreen = () => {
    const date = new Date();
    const HEADER_HEIGHT = 400;

    const monthStart = startOfMonth(date);
    const weekStart = startOfWeek(monthStart, { weekStartOn: 0 });

    const [height, setHeight] = useState();
    const [curDate, setCurDate] = useState(date);
    const [curMonth, setCurMonth] = useState(getMonth(date));
    const [curYear, setCurYear] = useState(getYear(date));
    const [monthDays, setMonthDays] = useState([]);
    const [selectedDay, setSelectedDay] = useState(new Date());

    const offset = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      getMonthDays(curDate, curMonth);
    }, []);

    useEffect(() => {
      setCurMonth(getMonth(curDate));
      setCurYear(getYear(curDate));
    }, [curDate]);

    const getDay = () => {
      let dayWord = [];
      let tempDate;

      for (let i = 0; i < 7; i++) {
        tempDate = addDays(weekStart, i);
        dayWord.push(format(tempDate, "EEE"));
      }

      return dayWord;
    };

    const getWeekDays = (data, month) => {
      const weekStart = startOfWeek(data, { weekStartOn: 0 });
      const weekLength = 7;
      const weekList = [];

      const monthFunction = (tempDate) => {
        if (getMonth(tempDate) === month)
          return "cur"

        if (getMonth(tempDate) < month)
          return "pre"

        if (getMonth(tempDate) > month)
          return "next"
      }

      for (let i = 0; i < weekLength; i++) {
        const tempDate = addDays(weekStart, i);

        weekList.push({
          key: getDate(tempDate),
          date: tempDate,
          day: getDate(tempDate),
          month: monthFunction(tempDate),
        });
      }
      return weekList;
    };

    const getMonthDays = (data, month) => {
      const monthList = [];
      const monthStart = startOfMonth(data);
      const weekLength = getWeeksInMonth(monthStart);

      for (let i = 0; i < weekLength; i++) {
        const count = i * 7;
        const weekStartDate = addDays(monthStart, count);
        monthList.push(getWeekDays(weekStartDate, month));
      }
      setCurDate(data);
      setMonthDays(monthList);

      return monthList;
    };

    const getNextMonth = () => {
      const nextDate = addMonths(curDate, 1);
      const month = getMonth(nextDate);

      return getMonthDays(nextDate, month);
    };

    const getPreMonth = () => {
      const preDate = addMonths(curDate, -1);
      const month = getMonth(preDate);

      return getMonthDays(preDate, month);
    };

    const AnimatedHeader = ({ animatedValue }) => {
      const insets = useSafeAreaInsets();

      const headerHeight = animatedValue.interpolate({
        inputRange: [0, HEADER_HEIGHT + insets.top],
        outputRange: [HEADER_HEIGHT + insets.top, insets.top - 80],
        extrapolate: "clamp",
      });

      const DayMonthColorFunction = (month, date) => {
        if (month !== "cur")
          return style.notCurMonthDayText;
        if (selectedDay.toLocaleDateString() === date.toLocaleDateString())
          return style.selectedDayText;
        return null;
      }

      return (
        <Animated.View
          style={{ top: 0, left: 0, right: 0, height: headerHeight }}
        >
          <View style={{ margin: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <TouchableOpacity onPress={getPreMonth}>
              <ArrowLeft />
            </TouchableOpacity>
            <Text style={{ fontSize: 15, fontWeight: "bold", marginLeft: 10, marginRight: 10 }}>
              {curYear}년 {curMonth + 1}월
            </Text>
            <TouchableOpacity onPress={getNextMonth}>
              <ArrowRight />
            </TouchableOpacity>
          </View>
          <Text style={{ alignSelf: "center" }}>
            {
              getDay().map((item, index) => {
                const DayColorFunction = () => {
                  switch (item) {
                    case "Sun": return "red";
                    case "Sat": return "blue";
                    default: return "#b1b1b1";
                  }
                }

                return (
                  <View style={{width: 50, height: 30, alignItems: "center", justifyContent: "center"}} key={index.toString()}>
                    <Text style={{ fontSize: 10, color: DayColorFunction()}}>{item}</Text>
                  </View>
                );
              })
            }
          </Text>
          {
            height >= 400 ?
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}
                          onMomentumScrollEnd={(e) => {
                            e.nativeEvent.contentOffset.x === 0 && getPreMonth();
                            e.nativeEvent.contentOffset.x >= 1350 && getNextMonth();
                          }}>
                {monthDays ? monthDays.map((item) => {
                  return (
                    item.map(({ month, day, date }, index) => {
                      return (
                        <TouchableOpacity
                          key={index.toString()}
                          onPress={() => setSelectedDay(date)}
                          style={[style.dayView, (selectedDay.toLocaleDateString() === date.toLocaleDateString()) ? style.today : null]}>
                          <Text style={[style.dayText, DayMonthColorFunction(month, date)]}>{day}</Text>
                        </TouchableOpacity>
                      );
                    })
                  );
                }) : null}
              </ScrollView>
              :
              <View style={{ justifyContent: "center", flexDirection: "row", flexWrap: "wrap" }}>
                {monthDays ? monthDays.map((item) => {
                  return (
                    item.map(({ month, day, date }, index) => {
                      return (
                        <TouchableOpacity
                          key={index.toString()}
                          onPress={() => setSelectedDay(date)}
                          style={[style.dayView, (selectedDay.toLocaleDateString() === date.toLocaleDateString()) ? style.today : null]}>
                          <Text style={[style.dayText, DayMonthColorFunction(month, date)]}>{day}</Text>
                        </TouchableOpacity>
                      );
                    })
                  );
                }) : null}
              </View>
          }
        </Animated.View>
      );
    };


    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <AnimatedHeader animatedValue={offset} />
        <ScrollView
          onLayout={e => setHeight(e.nativeEvent.layout.height)}
          style={{ flex: 1, backgroundColor: "white" }}
          contentContainerStyle={{
            alignItems: "center",
            paddingHorizontal: 20,
          }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={100}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: offset }} }], { useNativeDriver: false })}
        >
          <View style={{ width: screenWidth, height: screenHeight * 0.9, borderTopWidth: 1, backgroundColor: "#2CDDE9" }} />
        </ScrollView>
      </View>
    );
  }
;

const style = StyleSheet.create({
  dayView: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    fontSize: 18,
    color: "#222222",
  },
  notCurMonthDayText: {
    fontSize: 18,
    color: "#b1b1b1",
  },
  selectedDayText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  today: {
    width: 50,
    height: 50,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#2CDDE9",
  },
});
export default CalendarScreen;
