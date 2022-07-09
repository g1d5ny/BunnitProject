import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  addDays,
  addMonths,
  format,
  getDate,
  getMonth,
  getWeeksInMonth, getYear,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { screenHeight, screenWidth } from "../style/DimenStyle";
import GestureRecognizer from "react-native-swipe-gestures";


const CalendarScreen = () => {
  const date = new Date(); //오늘날짜를 생성
  const monthStart = startOfMonth(date);  // 이번달 1일
  // const curMonth = getMonth(date);//오늘날짜를 기준으로 현재달을 구한다
  const weekStart = startOfWeek(monthStart, { weekStartOn: 0 }); // 1일을 기준으로 주의 시작 일자 (0부터 시작 : 일요일부터 시작)

  const [monthDays, setMonthDays] = useState([]);
  const [curMonth, setCurMonth] = useState(getMonth(date));
  const [curYear, setCurYear] = useState(getYear(date));

  useEffect(() => {
    getMonthDays(date, curMonth)
  }, [curMonth])

  useEffect(() => {

  }, [monthDays])

  //요일 표시법바꾸기
  const getDay = () => {
    let dayWord = [];
    let tempDate;

    for (let i = 0; i < 7; i++) {
      tempDate = addDays(weekStart, i);
      dayWord.push(format(tempDate, "EEE"));
    }

    return dayWord;
  };

  //한주 구하기
  const getWeekDays = (data, month) => {
    const weekStart = startOfWeek(data, { weekStartOn: 1 });//기준날짜를 통해 주 시작일 구하기
    const weekLength = 7;
    const weekList = [];

    for (let i = 0; i < weekLength; i++) {
      const tempDate = addDays(weekStart, i);
      // const formatted = getDay(format(tempDate,'EEE'));

      if (getMonth(tempDate) === month) {
        weekList.push({
          key: getDate(tempDate),
          // formatted,
          date: tempDate,
          day: getDate(tempDate),
          month: "cur",
        });
      } else if (getMonth(tempDate) < month) {
        weekList.push({
          key: getDate(tempDate),
          // formatted,
          date: tempDate,
          day: getDate(tempDate),
          month: "pre",
        });

      } else if (getMonth(tempDate) > month) {
        weekList.push({
          key: getDate(tempDate),
          // formatted,
          date: tempDate,
          day: getDate(tempDate),
          month: "next",
        });

      }
    }
    return weekList;
  };


  //한달구하기
  const getMonthDays = (data, month) => {

    const monthStart = startOfMonth(data); //달 시작일 구하기 --> 1일

    const monthList = [];
    const weekLength = getWeeksInMonth(monthStart); //--> 기준달이 몇주인지 구하기
    for (let i = 0; i < weekLength; i++) {
      const count = i * 7;
      const weekStartDate = addDays(monthStart, count);
      monthList.push(getWeekDays(weekStartDate, month));
    }

    console.log("data: ", data, ", month: ", month);

    setMonthDays(monthList)//오늘날짜와 현재달을 갖고 한달의 날짜를 구한다)
    return monthList;
  };


  //다음달구하기
  const getNextMonth = () => {
    console.log("getNextMonth");
    setCurMonth(curMonth+1);
    const nextDate = addMonths(curMonth, 1);
    const month = getMonth(nextDate);
    return getMonthDays(nextDate, month);
  };

  //이전달 구하기
  const getPreMonth = () => {
    console.log("getPreMonth : ", monthStart);
    setCurMonth(curMonth-1);
    const preDate = addMonths(curMonth, -1);
    const month = getMonth(preDate);
    return getMonthDays(preDate, month);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text>{curYear} {curMonth+1}</Text>
      </View>
      <Text style={{ width: screenWidth, height: 30 }}>{
        getDay().map((item, index) => {
          return (
            <View style={[style.dayView]} key={index.toString()}>
              <Text style={{
                fontSize: 10,
                color: item === "Sun" ? "red" : (item === "Sat" ? "blue" : "#b1b1b1"),
              }}>{item}</Text>
            </View>
          );
        })
      }</Text>
      <GestureRecognizer style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}
                         onSwipeUp={() => getNextMonth()}
                         onSwipeDown={() => getPreMonth()}>
        {monthDays ? monthDays.map((el) => {
          return (
            el.map(({ month, day }, index) => {
              return (
                <View
                  style={[style.dayView]}
                  key={index.toString()}>
                  <Text
                    style={[style.dayText, month !== "cur" ? style.dayText2 : null]}>{day}</Text>
                </View>
              );
            })
          );
        }) : null}
      </GestureRecognizer>
    </View>
  );
};

const style = StyleSheet.create({
  calendarView: {
    // flex: 1,
    width: "100%",
  },
  calendar: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  dayView: {
    width: screenWidth * 0.14,
    height: screenHeight * 0.14,
    alignItems: "center",
  },
  dayText: {
    fontSize: 10,
    color: "#222222",
  },
  dayText2: {
    fontSize: 10,
    color: "#b1b1b1",
  },
  dayText3: {
    fontSize: 10,
    color: "red",
  },
  today: {
    color: "purple",
    fontWeight: "bold",
  },
  dayLine: {
    width: "100%",
    alignContent: "flex-start",
    marginBottom: 4,
  },
  dayLineText: {
    fontSize: 10,
  },
});
export default CalendarScreen;
