import checkDate from "./check-date";

export const weeklyChart = (chartItems: { date: Date; revenue: number }[]) => {
  return [
    {
      date: "4 weeks ago",
      revenue: chartItems
        .filter((order) => checkDate(order.date, 6))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "3 weeks ago",
      revenue: chartItems
        .filter((order) => checkDate(order.date, 5))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "2 weeks ago",
      revenue: chartItems
        .filter((order) => checkDate(order.date, 4))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "1 weeks ago",
      revenue: chartItems
        .filter((order) => checkDate(order.date, 3))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "this week",
      revenue: chartItems
        .filter((order) => checkDate(order.date, 2))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
  ];
};
