import React, { useEffect, useRef, useState } from "react";
import {
  Animated, Dimensions, ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  addDays,
  addMonths,
  format,
  getDate,
  getMonth,
  getWeeksInMonth,
  getYear,
  startOfMonth,
  startOfWeek,
} from "date-fns";
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

  useEffect(() => {

  }, [height])

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

    for (let i = 0; i < weekLength; i++) {
      const tempDate = addDays(weekStart, i);

      if (getMonth(tempDate) === month) {
        weekList.push({
          key: getDate(tempDate),
          date: tempDate,
          day: getDate(tempDate),
          month: "cur",
        });
      } else if (getMonth(tempDate) < month) {
        weekList.push({
          key: getDate(tempDate),
          date: tempDate,
          day: getDate(tempDate),
          month: "pre",
        });

      } else if (getMonth(tempDate) > month) {
        weekList.push({
          key: getDate(tempDate),
          date: tempDate,
          day: getDate(tempDate),
          month: "next",
        });

      }
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
      outputRange: [HEADER_HEIGHT + insets.top, insets.top-80],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        onLayout={e => console.log("height:", e.nativeEvent.layout.height)}
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: headerHeight,
        }}
      >
        <View style={{
          margin: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <TouchableOpacity onPress={getPreMonth}>
            <ArrowLeft />
          </TouchableOpacity>
          <Text style={{
            fontSize: 15,
            fontWeight: "bold",
            marginLeft: 10,
            marginRight: 10,
          }}>{curYear}년 {curMonth + 1}월</Text>
          <TouchableOpacity onPress={getNextMonth}>
            <ArrowRight />
          </TouchableOpacity>
        </View>
        <Text style={{ alignSelf: "center" }}>
          {
            getDay().map((item, index) => {
              return (
                <View style={[style.weekView]} key={index.toString()}>
                  <Text style={{
                    fontSize: 10,
                    color: item === "Sun" ? "red" : (item === "Sat" ? "blue" : "#b1b1b1"),
                  }}>{item}</Text>
                </View>
              );
            })
          }
        </Text>
        {
          height >= 400 ?
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {monthDays ? monthDays.map((el) => {
                return (
                  el.map(({ month, day, date }, index) => {
                    return (
                      <TouchableOpacity
                        key={index.toString()}
                        onPress={() => setSelectedDay(date)}
                        style={[style.dayView, (selectedDay === date || selectedDay.toLocaleDateString() === date.toLocaleDateString()) ? style.today : null]}>
                        <Text
                          style={[style.dayText, month !== "cur" ? style.dayText2 : (selectedDay === date || selectedDay.toLocaleDateString() === date.toLocaleDateString()) ? style.dayText3 : null]}>{day}</Text>
                      </TouchableOpacity>
                    );
                  })
                );
              }) : null}
            </ScrollView>
            :
          <View style={{ justifyContent: "center", flexDirection: "row", flexWrap: "wrap" }}>
            {monthDays ? monthDays.map((el) => {
              return (
                el.map(({ month, day, date }, index) => {
                  return (
                    <TouchableOpacity
                      key={index.toString()}
                      onPress={() => setSelectedDay(date)}
                      style={[style.dayView, (selectedDay === date || selectedDay.toLocaleDateString() === date.toLocaleDateString()) ? style.today : null]}>
                      <Text
                        style={[style.dayText, month !== "cur" ? style.dayText2 : (selectedDay === date || selectedDay.toLocaleDateString() === date.toLocaleDateString()) ? style.dayText3 : null]}>{day}</Text>
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
        style={{ flex: 1, backgroundColor: 'white' }}
        contentContainerStyle={{
          alignItems: 'center',
          // paddingTop: 200,
          paddingHorizontal: 20
        }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={100}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: offset } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={{ width: screenWidth, borderTopWidth: 1, backgroundColor: "#2CDDE9" }}>
          <Text style={{ alignSelf: "center" }}>추가 버튼을 눌러 {"\n"}식단을 기록해주세요</Text>
          <Text style={{ alignSelf: "center" }}>추가 버튼을 눌러 {"\n"}식단을 기록해주세요</Text>
          <Text style={{ alignSelf: "center" }}>추가 버튼을 눌러 {"\n"}식단을 기록해주세요</Text>
          <Text style={{ alignSelf: "center" }}>추가 버튼을 눌러 {"\n"}식단을 기록해주세요</Text>
          <Text style={{ alignSelf: "center" }}>추가 버튼을 눌러 {"\n"}식단을 기록해주세요</Text>
          <Text style={{ alignSelf: "center" }}>추가 버튼을 눌러 {"\n"}식단을 기록해주세요</Text>
          <Text style={{ alignSelf: "center" }}>추가 버튼을 눌러 {"\n"}식단을 기록해주세요</Text>
          <Text style={{ alignSelf: "center" }}>추가 버튼을 눌러 {"\n"}식단을 기록해주세요</Text>
          <Text style={{ alignSelf: "center" }}>추가 버튼을 눌러 {"\n"}식단을 기록해주세요</Text>
          <Text style={{ alignSelf: "center" }}>추가 버튼을 눌러 {"\n"}식단을 기록해주세요</Text>
          <Text style={{ alignSelf: "center" }}>추가 버튼을 눌러 {"\n"}식단을 기록해주세요</Text>
          <Text style={{ alignSelf: "center" }}>추가 버튼을 눌러 {"\n"}식단을 기록해주세요</Text>
          <Text style={{ alignSelf: "center" }}>추가 버튼을 눌러 {"\n"}식단을 기록해주세요</Text>
          <Text style={{ alignSelf: "center" }}>추가 버튼을 눌러 {"\n"}식단을 기록해주세요</Text>
          <Text style={{ alignSelf: "center" }}>추가 버튼을 눌러 {"\n"}식단을 기록해주세요</Text>
          <Text style={{ alignSelf: "center" }}>추가 버튼을 눌러 {"\n"}식단을 기록해주세요</Text>
          <Text style={{ alignSelf: "center" }}>추가 버튼을 눌러 {"\n"}식단을 기록해주세요</Text>
          <Text style={{ alignSelf: "center" }}>추가 버튼을 눌러 {"\n"}식단을 기록해주세요</Text>
          <Text style={{ alignSelf: "center" }}>추가 버튼을 눌러 {"\n"}식단을 기록해주세요</Text>
          <Text style={{ alignSelf: "center" }}>추가 버튼을 눌러 {"\n"}식단을 기록해주세요</Text>
          <Text style={{ alignSelf: "center" }}>추가 버튼을 눌러 {"\n"}식단을 기록해주세요</Text>
          <Text style={{ alignSelf: "center" }}>추가 버튼을 눌러 {"\n"}식단을 기록해주세요</Text>
          <Text style={{ alignSelf: "center" }}>추가 버튼을 눌러 {"ㅇ\n"}식단을 기록해주세요</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  weekView: {
    width: 50,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
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
  dayText2: {
    fontSize: 18,
    color: "#b1b1b1",
  },
  dayText3: {
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
