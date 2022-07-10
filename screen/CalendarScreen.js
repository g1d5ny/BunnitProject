import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
import { screenWidth } from "../style/DimenStyle";
import GestureRecognizer from "react-native-swipe-gestures";
import ArrowLeft from "../asset/icon/icon_arrow_left.svg";
import ArrowRight from "../asset/icon/icon_arrow_right.svg";


const CalendarScreen = () => {
  const date = new Date();
  const monthStart = startOfMonth(date);
  const weekStart = startOfWeek(monthStart, { weekStartOn: 0 });

  const [curDate, setCurDate] = useState(date);
  const [curMonth, setCurMonth] = useState(getMonth(date));
  const [curYear, setCurYear] = useState(getYear(date));
  const [monthDays, setMonthDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState();

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
    const weekStart = startOfWeek(data, { weekStartOn: 1 });
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

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ margin: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
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
      <Text>
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
      <GestureRecognizer style={{ flexDirection: "row", flexWrap: "wrap" }}
                         onSwipeUp={getNextMonth}
                         onSwipeDown={getPreMonth}>
        {monthDays ? monthDays.map((el) => {
          return (
            el.map(({ month, day, date }, index) => {
              return (
                <TouchableOpacity
                  key={index.toString()}
                  onPress={() => setSelectedDay(date)}
                  style={[style.dayView, selectedDay === date ? style.today : null]}>
                  <Text
                    style={[style.dayText, month !== "cur" ? style.dayText2 : selectedDay === date ? style.dayText3 : null]}>{day}</Text>
                </TouchableOpacity>
              );
            })
          );
        }) : null}
      </GestureRecognizer>
      <View style={{flex: 1, borderWidth:1, borderColor: "#b1b1b1"}}>

      </View>
    </View>
  );
};

const style = StyleSheet.create({
  weekView: {
    width: screenWidth * 0.14,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  dayView: {
    width: screenWidth * 0.14,
    height: 60,
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
    fontWeight: 'bold',
    color: "#222"
  },
  today: {
    width: screenWidth * 0.14,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#2CDDE9",
  },
});
export default CalendarScreen;
