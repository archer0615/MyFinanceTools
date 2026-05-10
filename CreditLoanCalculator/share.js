const SHARE_STORAGE_KEY = "credit-loan-calculator-share";

const shareElements = {
  generatedAt: document.querySelector("#share-generated-at"),
  emptyState: document.querySelector("#share-empty-state"),
  content: document.querySelector("#share-content"),
  userName: document.querySelector("#share-user-name"),
  bankName: document.querySelector("#share-bank-name"),
  reportDate: document.querySelector("#share-report-date"),
  reportNote: document.querySelector("#share-report-note"),
  monthlyPayment: document.querySelector("#share-monthly-payment"),
  totalPayment: document.querySelector("#share-total-payment"),
  totalInterest: document.querySelector("#share-total-interest"),
  apr: document.querySelector("#share-apr"),
  loanAmount: document.querySelector("#share-loan-amount"),
  annualRate: document.querySelector("#share-annual-rate"),
  loanMonths: document.querySelector("#share-loan-months"),
  handlingFee: document.querySelector("#share-handling-fee"),
  loanRangeConservative: document.querySelector("#share-loan-range-conservative"),
  loanRangeBalanced: document.querySelector("#share-loan-range-balanced"),
  loanRangeAggressive: document.querySelector("#share-loan-range-aggressive"),
  totalDebtPayment: document.querySelector("#share-total-debt-payment"),
  overallDebtRatio: document.querySelector("#share-overall-debt-ratio"),
  incomeAfterDebt: document.querySelector("#share-income-after-debt"),
  incomeAfterAllExpenses: document.querySelector("#share-income-after-all-expenses"),
  prepaymentStatus: document.querySelector("#share-prepayment-status"),
  interestSaved: document.querySelector("#share-interest-saved"),
  monthsSaved: document.querySelector("#share-months-saved"),
  penaltyCost: document.querySelector("#share-penalty-cost"),
  extraPrepayBody: document.querySelector("#share-extra-prepay-body"),
  adviceList: document.querySelector("#share-advice-list"),
  compareBody: document.querySelector("#share-compare-body"),
};

function renderEmptyShare() {
  shareElements.generatedAt.textContent = "請先回主頁完成試算，這裡才會顯示分享摘要。";
  shareElements.emptyState.hidden = false;
  shareElements.content.hidden = true;
}

function renderShareTableRows(target, rows, emptyMessage, renderer, colspan) {
  if (!rows.length) {
    target.innerHTML = `
      <tr>
        <td colspan="${colspan}" class="empty-cell">${emptyMessage}</td>
      </tr>
    `;
    return;
  }

  target.innerHTML = rows.map(renderer).join("");
}

function loadShareSnapshot() {
  const raw = localStorage.getItem(SHARE_STORAGE_KEY);
  if (!raw) {
    renderEmptyShare();
    return;
  }

  try {
    const snapshot = JSON.parse(raw);
    shareElements.generatedAt.textContent = `最近一次分享快照建立於 ${new Date(snapshot.generatedAt).toLocaleString("zh-TW")}。`;
    shareElements.emptyState.hidden = true;
    shareElements.content.hidden = false;

    shareElements.userName.textContent = snapshot.reportUserName || "-";
    shareElements.bankName.textContent = snapshot.reportBankName || "-";
    shareElements.reportDate.textContent = snapshot.reportDate || "-";
    shareElements.reportNote.textContent = snapshot.reportNote || "-";
    shareElements.monthlyPayment.textContent = snapshot.monthlyPayment || "-";
    shareElements.totalPayment.textContent = snapshot.totalPayment || "-";
    shareElements.totalInterest.textContent = snapshot.totalInterest || "-";
    shareElements.apr.textContent = snapshot.aprEstimate || "-";
    shareElements.loanAmount.textContent = snapshot.loanAmount || "-";
    shareElements.annualRate.textContent = snapshot.annualRate || "-";
    shareElements.loanMonths.textContent = snapshot.loanMonths ? `${snapshot.loanMonths} 期` : "-";
    shareElements.handlingFee.textContent = snapshot.handlingFee || "-";
    shareElements.loanRangeConservative.textContent = snapshot.loanRange?.conservative || "-";
    shareElements.loanRangeBalanced.textContent = snapshot.loanRange?.balanced || "-";
    shareElements.loanRangeAggressive.textContent = snapshot.loanRange?.aggressive || "-";
    shareElements.totalDebtPayment.textContent = snapshot.debtOverview?.totalDebtPayment || "-";
    shareElements.overallDebtRatio.textContent = snapshot.debtOverview?.overallDebtRatio || "-";
    shareElements.incomeAfterDebt.textContent = snapshot.debtOverview?.incomeAfterDebt || "-";
    shareElements.incomeAfterAllExpenses.textContent = snapshot.debtOverview?.incomeAfterAllExpenses || "-";
    shareElements.prepaymentStatus.textContent = snapshot.prepaymentSummary?.status || "未設定提前清償。";
    shareElements.interestSaved.textContent = snapshot.prepaymentSummary?.interestSaved || "-";
    shareElements.monthsSaved.textContent = snapshot.prepaymentSummary?.monthsSaved || "-";
    shareElements.penaltyCost.textContent = snapshot.prepaymentSummary?.penaltyCost || "-";

    renderShareTableRows(
      shareElements.extraPrepayBody,
      snapshot.extraPrepayEvents || [],
      "未設定提前清償事件",
      (row) => `
        <tr>
          <td data-label="月份">${row.month}</td>
          <td data-label="金額">${row.amount}</td>
          <td data-label="手續費">${row.fee}</td>
          <td data-label="違約金率">${row.penaltyRate}</td>
        </tr>
      `,
      4,
    );

    if (snapshot.adviceCards?.length) {
      shareElements.adviceList.innerHTML = snapshot.adviceCards.map((card) => `
        <article class="advice-card">
          <strong>${card.title}</strong>
          <span>${card.body}</span>
        </article>
      `).join("");
    } else {
      shareElements.adviceList.innerHTML = `<article class="advice-card empty-advice">尚無建議資料。</article>`;
    }

    renderShareTableRows(
      shareElements.compareBody,
      snapshot.compareRows || [],
      "尚無比較資料",
      (row) => `
        <tr>
          <td data-label="方案">${row.name}</td>
          <td data-label="月付金">${row.monthlyPayment}</td>
          <td data-label="總還款">${row.totalPayment}</td>
          <td data-label="總利息">${row.totalInterest}</td>
          <td data-label="實拿金額">${row.netAmount}</td>
          <td data-label="APR">${row.aprEstimate}</td>
          <td data-label="判讀">${row.note}</td>
        </tr>
      `,
      7,
    );
  } catch {
    renderEmptyShare();
  }
}

loadShareSnapshot();
