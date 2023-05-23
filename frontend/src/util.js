import { DateTime } from "luxon";


export const groupByMonth = (data) => {
    return data.reduce((results, curr) => {
      const date = new Date(curr.date);
      const month = date.toLocaleString("default", { month: "long" });
      if (!results[month]) {
        results[month] = { data: [], total: 0 };
      }
      results[month].data.push(curr);
      results[month].total += parseInt(curr.amount);
      return results;
    }, {});
  };
  
  export const calculateTotal = (data) => {
    return data.reduce((total, item) => {
      return total + parseInt(item.amount);
    }, 0);
  };
  
  export const todaysData = (data) => {
    const today = DateTime.local().toISODate();
    return data.reduce((results, curr) => {
      const currDate = DateTime.fromISO(curr.date).toISODate();
      if (currDate === today) {
        if (!results[today]) {
          results[today] = { data: [], total: 0 };
        }
        results[today].data.push(curr);
        results[today].total += parseInt(curr.amount);
      }
      return results;
    }, {});
  };
  
  export const handleMonthClick = (month, selectedMonth, setSelectedMonth) => {
    setSelectedMonth((prevMonth) => (prevMonth === month ? null : month));
  };
  

  export const groupByCategory = (data, type) => {
    return data.reduce((results, item) => {
      const category = item.category;
      if (!results[category]) {
        results[category] = {};
      }
      if (!results[category][type]) {
        results[category][type] = 0;
      }
      results[category][type] += parseInt(item.amount);
      return results;
    }, {});
  };