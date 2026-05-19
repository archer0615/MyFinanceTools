function createPortfolioInsights(state) {
  const portfolioMetrics = state.portfolio.metrics || calculatePortfolioMetrics(state.portfolio.holdings || []);
  const result = state.simulations.result || {};
  const fire = state.simulations.fire;
  const monteCarlo = state.simulations.monteCarlo;
  const insights = [];

  if (portfolioMetrics.weightedVolatility >= 0.22) {
    insights.push(createInsight("risk", "高波動配置", "目前配置波動偏高，遇到熊市時資產淨值可能有明顯下修。", "降低單一高波動 ETF 權重或加入較低波動資產。"));
  }
  if (portfolioMetrics.weightedDividendYield >= 0.03) {
    insights.push(createInsight("income", "股息能力強", "目前組合具備較高現金流特徵，適合用於被動收入追蹤。", "同步檢查總報酬與稅後股息拖累。"));
  }
  if (Number.isFinite(result.maxDrawdown) && result.maxDrawdown < -0.35) {
    insights.push(createInsight("drawdown", "回撤壓力大", "估算最大回撤超過 35%，投資人需要預先設定再平衡與加碼規則。", "執行壓力測試並檢查最長水下期間。"));
  }
  if (fire && fire.metrics.targetGap > 0) {
    insights.push(createInsight("fire", "FIRE 缺口", "目前累積路徑尚未達成退休資產目標。", "使用反推月投入或目標 CAGR 調整計畫。"));
  }
  if (monteCarlo && monteCarlo.successRate < 0.7) {
    insights.push(createInsight("probability", "成功率偏低", "Monte Carlo 成功率低於 70%，結果對報酬假設較敏感。", "提高投入、延長年期或降低目標提領。"));
  }
  if (!insights.length) {
    insights.push(createInsight("balanced", "配置穩定", "目前組合在成長、風險與現金流之間維持相對平衡。", "持續追蹤再平衡偏移與費用率。"));
  }

  return insights;
}

function createInsight(type, title, message, action) {
  return { type, title, message, action };
}
