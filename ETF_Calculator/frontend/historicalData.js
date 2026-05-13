const historicalData = {
  SP500: [
    { year: 2000, return: -0.091 },
    { year: 2001, return: -0.119 },
    { year: 2002, return: -0.221 },
    { year: 2003, return: 0.286 },
    { year: 2004, return: 0.109 },
    { year: 2005, return: 0.049 },
    { year: 2006, return: 0.158 },
    { year: 2007, return: 0.055 },
    { year: 2008, return: -0.37 },
    { year: 2009, return: 0.265 },
    { year: 2020, return: 0.184 },
    { year: 2021, return: 0.287 },
    { year: 2022, return: -0.181 },
    { year: 2023, return: 0.264 }
  ],
  CASH: [
    { year: 2000, return: 0.01 },
    { year: 2001, return: 0.01 },
    { year: 2002, return: 0.01 },
    { year: 2003, return: 0.01 },
    { year: 2004, return: 0.01 },
    { year: 2005, return: 0.01 },
    { year: 2006, return: 0.01 },
    { year: 2007, return: 0.01 },
    { year: 2008, return: 0.01 },
    { year: 2009, return: 0.01 },
    { year: 2020, return: 0.005 },
    { year: 2021, return: 0.005 },
    { year: 2022, return: 0.01 },
    { year: 2023, return: 0.015 }
  ],
  regimes: {
    dotcom: { label: "網路泡沫", years: [2000, 2001, 2002] },
    crisis2008: { label: "金融海嘯", years: [2007, 2008, 2009] },
    covid: { label: "疫情衝擊", years: [2020] },
    rateHike: { label: "升息熊市", years: [2022] }
  },
  correlationMatrix: {
    stockBond: 0.22,
    stockCash: 0.04,
    bondCash: 0.18
  }
};
