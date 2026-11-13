const app = document.getElementById("app");
const modalRoot = document.getElementById("modal-root");
const toast = document.getElementById("toast");

const STUDENT_ID = "2025246288";
const STUDENT_NAME = "吕炳彦";
const COLLEGE = "医学院";
const BALANCE = "39.05";

const state = {
  page: "home",
  history: [],
  recordTab: "consume",
  rechargeAmount: "",
  rechargeMethod: "wechat",
  serviceKey: "lost",
  qrSeed: 20261113,
  modal: null,
};

const serviceConfig = {
  lost: {
    title: "挂失解挂",
    fields: [
      { label: "学工号", value: STUDENT_ID, readonly: true },
      { label: "卡片类型", value: "正式卡", readonly: true },
    ],
    button: "挂失",
  },
  bank: {
    title: "银行卡绑定",
    fields: [
      { label: "持卡人", placeholder: "请输入持卡人姓名" },
      { label: "银行卡号", placeholder: "请输入银行卡号" },
      { label: "手机号", placeholder: "请输入预留手机号" },
    ],
    button: "绑定",
  },
  password: {
    title: "密码修改",
    fields: [
      { label: "原密码", placeholder: "请输入原密码", type: "password" },
      { label: "新密码", placeholder: "请输入新密码", type: "password" },
      { label: "确认密码", placeholder: "请再次输入新密码", type: "password" },
    ],
    button: "确认修改",
  },
  limit: {
    title: "限额修改",
    fields: [
      { label: "单笔限额", placeholder: "请输入金额", suffix: "元" },
      { label: "日累计限额", placeholder: "请输入金额", suffix: "元" },
    ],
    button: "保存",
  },
  electricity: {
    title: "电费缴纳",
    fields: [
      { label: "房间号", placeholder: "请输入房间号" },
      { label: "缴费金额", placeholder: "请输入金额", suffix: "元" },
    ],
    button: "立即缴费",
  },
  meal: {
    title: "在线点餐",
    fields: [
      { label: "食堂", placeholder: "请选择食堂" },
      { label: "窗口", placeholder: "请选择窗口" },
      { label: "餐次", placeholder: "请选择餐次" },
    ],
    button: "进入点餐",
  },
  refund: {
    title: "销户退款",
    fields: [
      { label: "学工号", value: STUDENT_ID, readonly: true },
      { label: "退款银行卡", placeholder: "请选择退款银行卡" },
    ],
    button: "申请销户",
  },
};

const consumeRecords = [
  {
    merchant: "学三一层5窗口",
    method: "账户余额",
    channel: "支付码消费",
    device: "学三食堂1F收费机-011",
    time: "2026-11-04 12:42",
    amount: "-16.40",
  },
  {
    merchant: "学五三层10组",
    method: "账户余额",
    channel: "支付码消费",
    device: "学五浓香食堂3F收费机-032",
    time: "2026-11-03 18:20",
    amount: "-12.00",
  },
  {
    merchant: "学五三层9组",
    method: "账户余额",
    channel: "支付码消费",
    device: "学五浓香食堂3F收费机-025",
    time: "2026-11-03 18:07",
    amount: "-13.00",
  },
];

const authRecords = [
  {
    merchant: "图书馆东门",
    method: "校园卡认证",
    channel: "认证码",
    device: "图书馆东门-02",
    time: "2026-11-04 08:12",
    amount: "认证成功",
  },
  {
    merchant: "宿舍门禁",
    method: "校园卡认证",
    channel: "认证码",
    device: "学五宿舍-01",
    time: "2026-11-03 22:41",
    amount: "认证成功",
  },
  {
    merchant: "体育馆入口",
    method: "校园卡认证",
    channel: "认证码",
    device: "体育馆入口-03",
    time: "2026-11-02 16:05",
    amount: "认证成功",
  },
];

function iconBack() {
  return `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 5 8 12l7 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
}

function iconChevron() {
  return `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m9 5 7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
}

function iconPerson() {
  return `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" fill="currentColor"/>
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="currentColor"/>
    </svg>
  `;
}

function iconBuilding() {
  return `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 21V5.5L12 2l7 3.5V21" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <path d="M9 8.5h1M14 8.5h1M9 12.5h1M14 12.5h1M9 16.5h1M14 16.5h1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
}

function iconQr(color = "currentColor") {
  return `
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="7" y="7" width="12" height="12" rx="2" stroke="${color}" stroke-width="3"/>
      <rect x="29" y="7" width="12" height="12" rx="2" stroke="${color}" stroke-width="3"/>
      <rect x="7" y="29" width="12" height="12" rx="2" stroke="${color}" stroke-width="3"/>
      <path d="M12 12h2v2h-2zM34 12h2v2h-2zM12 34h2v2h-2z" fill="${color}"/>
      <path d="M29 29h5v5h-5zM38 29h3v3h-3zM29 38h3v3h-3zM36 36h5v5h-5z" fill="${color}"/>
    </svg>
  `;
}

function iconYenCircle() {
  return `
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="3"/>
      <path d="m16 15 8 10 8-10M24 25v11M18 27h12M18 32h12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
}

function iconCardLock() {
  return `
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="5" y="14" width="38" height="24" rx="4" fill="#4a9cff"/>
      <path d="M5 21h38" stroke="#fff" stroke-width="3"/>
      <rect x="29" y="24" width="12" height="10" rx="2" fill="#2f7df6"/>
      <path d="M32 24v-3a3 3 0 0 1 6 0v3" stroke="#2f7df6" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="35" cy="29" r="1.6" fill="#fff"/>
    </svg>
  `;
}

function iconCardLink() {
  return `
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="5" y="13" width="38" height="24" rx="4" fill="#ff9b5c"/>
      <path d="M5 20h38" stroke="#fff" stroke-width="3"/>
      <path d="m29 31 4-4a4 4 0 0 1 6 6l-2 2M35 33l-4 4a4 4 0 0 1-6-6l2-2" stroke="#ff6b6b" stroke-width="2.4" stroke-linecap="round"/>
    </svg>
  `;
}

function iconLock() {
  return `
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M15 22v-5a9 9 0 0 1 18 0v5" stroke="#f5b72e" stroke-width="4" stroke-linecap="round"/>
      <rect x="10" y="21" width="28" height="22" rx="4" fill="#f5b72e"/>
      <circle cx="24" cy="31" r="3" fill="#fff"/>
      <path d="M24 33v4" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
    </svg>
  `;
}

function iconWalletYen() {
  return `
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="6" y="15" width="36" height="24" rx="4" fill="#52d3a3"/>
      <path d="M10 15V11a3 3 0 0 1 3-3h22" stroke="#52d3a3" stroke-width="3" stroke-linecap="round"/>
      <path d="m16 23 6 7 6-7M22 30v7M17 32h10M17 36h10" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="36" cy="29" r="6" fill="#fff"/>
      <path d="M36 26v6M33.5 28h5M33.5 31h5" stroke="#52d3a3" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
  `;
}

function iconBolt() {
  return `
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="7" y="7" width="34" height="34" rx="5" fill="#4aa8ff"/>
      <path d="M27 10 16 27h8l-3 11 11-17h-8l3-11Z" fill="#fff"/>
    </svg>
  `;
}

function iconCloche() {
  return `
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="7" y="7" width="34" height="34" rx="5" fill="#f5b72e"/>
      <path d="M13 32h22M15 32a9 9 0 0 1 18 0" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      <path d="M24 20v3" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      <circle cx="24" cy="18" r="2" fill="#fff"/>
    </svg>
  `;
}

function iconCardMinus() {
  return `
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="5" y="13" width="38" height="24" rx="4" fill="#ff9b5c"/>
      <path d="M5 20h38" stroke="#fff" stroke-width="3"/>
      <circle cx="35" cy="32" r="7" fill="#ff6b6b"/>
      <path d="M31.5 32h7" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
    </svg>
  `;
}

function iconHouse() {
  return `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-9Z" fill="currentColor"/>
    </svg>
  `;
}

function iconClipboardYen() {
  return `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="4" width="14" height="18" rx="2" fill="currentColor"/>
      <rect x="8" y="2" width="8" height="4" rx="1.5" fill="currentColor"/>
      <path d="m9 11 3 4 3-4M12 15v4M9.5 16h5M9.5 18h5" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
}

function iconUserNav() {
  return `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" fill="currentColor"/>
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="currentColor"/>
    </svg>
  `;
}

function iconBarChart() {
  return `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 20V10M12 20V4M19 20v-7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
    </svg>
  `;
}

function iconWalletSmall() {
  return `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="6" width="18" height="14" rx="3" fill="currentColor" opacity=".22"/>
      <path d="M5 8V6a2 2 0 0 1 2-2h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M8 11h8M8 15h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
}

function capsuleMarkup() {
  return `
    <div class="capsule" aria-hidden="true">
      <span class="capsule-dots"><i></i><i></i><i></i></span>
      <span class="capsule-divider"></span>
      <span class="capsule-target"></span>
    </div>
  `;
}

function headerMarkup(title, showBack) {
  return `
    <header class="mini-header">
      ${
        showBack
          ? `<button class="back-btn" type="button" data-action="back" aria-label="返回">${iconBack()}</button>`
          : ""
      }
      <div class="header-title">${title}</div>
      ${capsuleMarkup()}
    </header>
  `;
}

function tabbarMarkup() {
  const tabs = [
    { key: "home", label: "首页", icon: iconHouse() },
    { key: "records", label: "记录", icon: iconClipboardYen() },
    { key: "profile", label: "我的", icon: iconUserNav() },
  ];

  return `
    <nav class="tabbar" aria-label="底部导航">
      ${tabs
        .map(
          (tab) => `
            <button class="tab-item ${state.page === tab.key ? "active" : ""}" type="button" data-action="tab" data-page="${tab.key}">
              ${tab.icon}
              <span>${tab.label}</span>
            </button>
          `,
        )
        .join("")}
    </nav>
  `;
}

function homeMarkup() {
  return `
    <div class="home-page">
      <div class="home-hero">
        <div class="campus-card" role="img" aria-label="天津大学学生卡"></div>
        <div class="account-summary">
          <div class="account-row">
            <div class="account-left">
              ${iconPerson()}
              <span>${STUDENT_NAME}，您好！</span>
            </div>
            <div class="balance">￥${BALANCE}</div>
          </div>
          <div class="account-row">
            <div class="account-left">
              ${iconBuilding()}
              <span>${STUDENT_ID}</span>
            </div>
            <div class="status-pill">正常</div>
          </div>
        </div>
      </div>

      <section class="section">
        <h2 class="section-title">常用功能</h2>
        <div class="feature-grid">
          <button class="feature-item" type="button" data-action="go" data-page="payment">
            <span class="feature-icon blue">${iconQr("#fff")}</span>
            <span>支付码</span>
          </button>
          <button class="feature-item" type="button" data-action="go" data-page="auth">
            <span class="feature-icon orange">${iconQr("#fff")}</span>
            <span>认证码</span>
          </button>
          <button class="feature-item" type="button" data-action="go" data-page="recharge">
            <span class="feature-icon green">${iconYenCircle()}</span>
            <span>卡充值</span>
          </button>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">卡务中心</h2>
        <div class="service-grid">
          ${serviceButton("lost", iconCardLock(), "挂失解挂")}
          ${serviceButton("bank", iconCardLink(), "银行卡绑定")}
          ${serviceButton("password", iconLock(), "密码修改")}
          ${serviceButton("limit", iconWalletYen(), "限额修改")}
          ${serviceButton("electricity", iconBolt(), "电费缴纳")}
          ${serviceButton("meal", iconCloche(), "在线点餐")}
          ${serviceButton("refund", iconCardMinus(), "销户退款")}
        </div>
      </section>
    </div>
  `;
}

function serviceButton(key, icon, label) {
  return `
    <button class="service-item" type="button" data-action="service" data-service="${key}">
      <span class="service-icon">${icon}</span>
      <span>${label}</span>
    </button>
  `;
}

function recordsMarkup() {
  const isConsume = state.recordTab === "consume";
  const records = isConsume ? consumeRecords : authRecords;

  return `
    <div class="records-page">
      <div class="segmented" role="tablist" aria-label="记录类型">
        <button class="${isConsume ? "active" : ""}" type="button" data-action="record-tab" data-tab="consume" role="tab" aria-selected="${isConsume}">消费记录</button>
        <button class="${!isConsume ? "active" : ""}" type="button" data-action="record-tab" data-tab="auth" role="tab" aria-selected="${!isConsume}">认证记录</button>
      </div>

      <div class="records-summary">
        <div class="records-summary-top">
          <button class="month-button" type="button">
            本月
            <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="m2 4 4 4 4-4" fill="currentColor"/>
            </svg>
          </button>
          <button class="analysis-button" type="button" data-action="analysis">
            ${iconBarChart()}
            收支分析
          </button>
        </div>
        <div class="records-total">
          ${
            isConsume
              ? "当月充值：<strong>0元</strong>，消费：<em>49.40元</em>"
              : "当月认证：<em>12次</em>"
          }
        </div>
      </div>

      ${records
        .map(
          (record) => `
            <article class="record-card">
              <div class="record-ribbon">${isConsume ? "消费" : "认证"}</div>
              <div class="record-row"><span class="label">商户名称：</span><span class="value">${record.merchant}</span></div>
              <div class="record-row"><span class="label">${isConsume ? "消费方式" : "认证方式"}：</span><span class="value">${record.method}</span></div>
              <div class="record-row"><span class="label">${isConsume ? "消费渠道" : "认证渠道"}：</span><span class="value">${record.channel}</span></div>
              <div class="record-row"><span class="label">${isConsume ? "消费设备" : "认证设备"}：</span><span class="value">${record.device}</span></div>
              <div class="record-row"><span class="label">${isConsume ? "扣款时间" : "认证时间"}：</span><span class="value">${record.time}</span></div>
              <div class="record-amount ${isConsume ? "" : "success"}">${record.amount}</div>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function profileMarkup() {
  return `
    <div class="profile-page">
      <div class="profile-hero">
        <div class="profile-top">
          <img class="profile-avatar" src="assets/人像.png" alt="工作人员人像" />
          <div>
            <div class="profile-name">${STUDENT_NAME} | ${STUDENT_ID}</div>
            <div class="profile-meta">${COLLEGE}</div>
          </div>
          <button class="profile-arrow" type="button" data-action="go" data-page="personal" aria-label="个人信息">
            ${iconChevron()}
          </button>
        </div>
      </div>
      <div class="profile-stats">
        <div class="stat">
          <div class="stat-label">状态</div>
          <div class="stat-value green">正常</div>
        </div>
        <div class="stat">
          <div class="stat-label">账户余额</div>
          <div class="stat-value">${BALANCE}</div>
        </div>
        <div class="stat">
          <div class="stat-label">有效期</div>
          <div class="stat-value">2028.08.31</div>
        </div>
      </div>

      <div class="profile-menu">
        <button class="menu-row" type="button" data-action="service" data-service="bank">
          <span>银行卡</span>
          ${iconChevron()}
        </button>
        <button class="menu-row" type="button" data-action="service" data-service="password">
          <span>修改密码</span>
          ${iconChevron()}
        </button>
      </div>

      <button class="logout-row" type="button" data-action="logout">退出登录</button>
    </div>
  `;
}

function personalMarkup() {
  return `
    <div class="personal-page">
      <img class="personal-avatar" src="assets/人像.png" alt="工作人员人像" />
      <div class="personal-list">
        <div class="personal-row"><span>姓名</span><span>${STUDENT_NAME}</span></div>
        <div class="personal-row"><span>学工号</span><span>${STUDENT_ID}</span></div>
      </div>
    </div>
  `;
}

function paymentMarkup() {
  const now = new Date();
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const seconds = pad(now.getSeconds());

  return `
    <div class="payment-page">
      <div class="payment-card">
        <div class="payment-profile">
          <img class="payment-avatar" src="assets/人像.png" alt="工作人员人像" />
          <div class="payment-person">
            <div class="payment-name">${STUDENT_NAME}</div>
            <div class="payment-id">***${STUDENT_ID.slice(-3)}</div>
          </div>
          <div class="tju-mark">
            <span class="tju-seal">TJU</span>
            <span class="tju-text">天津大学<small>Tianjin University</small></span>
          </div>
        </div>
        <div class="payment-time">${date} ${time}:<span class="seconds">${seconds}</span></div>
        <div class="payment-hint">请将二维码对准扫描设备</div>
        ${qrMarkup(state.qrSeed, "#0757a6", true)}
        <div class="qr-note">二维码每60s刷新一次</div>
        <button class="refresh-btn" type="button" data-action="refresh-qr">刷新</button>
      </div>
      <div class="payment-balance">
        <div class="payment-balance-left">
          ${iconWalletSmall()}
          <span>账户余额</span>
        </div>
        <strong>${BALANCE}元 ${iconChevron()}</strong>
      </div>
    </div>
  `;
}

function authMarkup() {
  return `
    <div class="auth-page">
      <div class="auth-banner">
        ${iconPerson()}
        <span>${STUDENT_NAME} (${STUDENT_ID})</span>
      </div>
      <div class="auth-card">
        <div class="auth-title">请将二维码<br />对准扫描设备</div>
        ${qrMarkup(state.qrSeed + 7, "#111111", true)}
        <div class="qr-note">二维码每60s刷新一次</div>
        <button class="refresh-btn" type="button" data-action="refresh-qr">手动刷新支付码</button>
      </div>
      <div class="auth-bottom">
        ${iconQr("#fff")}
        <div>认证码</div>
      </div>
    </div>
  `;
}

function rechargeMarkup() {
  const methods = [
    { key: "rmb", label: "数字人民币", logo: "¥", className: "rmb" },
    { key: "bank", label: "交通银行", logo: "B", className: "bank" },
    { key: "wechat", label: "微信支付", logo: "W", className: "wechat" },
  ];

  return `
    <div class="recharge-page">
      <section class="recharge-section">
        <div class="field-label">充值金额(元)</div>
        <div class="amount-input">
          <span class="currency">￥</span>
          <input id="recharge-amount" inputmode="decimal" autocomplete="off" placeholder="请输入充值金额" value="${state.rechargeAmount}" />
        </div>
        <div class="amount-chips">
          ${["20", "50", "100", "200"]
            .map(
              (amount) => `
                <button class="amount-chip ${state.rechargeAmount === amount ? "active" : ""}" type="button" data-action="amount" data-amount="${amount}">${amount}</button>
              `,
            )
            .join("")}
        </div>
      </section>

      <section class="recharge-section">
        <div class="field-label">支付方式</div>
        ${methods
          .map(
            (method) => `
              <button class="pay-method" type="button" data-action="pay-method" data-method="${method.key}">
                <span class="pay-radio ${state.rechargeMethod === method.key ? "active" : ""}"></span>
                <span class="pay-logo ${method.className}">${method.logo}</span>
                <span>${method.label}</span>
              </button>
            `,
          )
          .join("")}
      </section>

      <div class="service-action">
        <button class="primary-btn" type="button" data-action="open-recharge-qr">充值</button>
      </div>
    </div>
  `;
}

function serviceMarkup() {
  const config = serviceConfig[state.serviceKey] || serviceConfig.lost;

  return `
    <div class="service-page">
      <div class="service-panel">
        ${config.fields
          .map((field) => {
            if (field.readonly) {
              return `
                <div class="service-row">
                  <label>${field.label}</label>
                  <span class="value">${field.value}</span>
                </div>
              `;
            }

            return `
              <div class="service-row">
                <label>${field.label}</label>
                <span class="service-input-wrap">
                  <input class="service-input" type="${field.type || "text"}" placeholder="${field.placeholder || ""}" autocomplete="off" />
                  ${field.suffix ? `<span class="service-suffix">${field.suffix}</span>` : ""}
                </span>
              </div>
            `;
          })
          .join("")}
      </div>
      <div class="service-action">
        <button class="primary-btn" type="button" data-action="service-confirm">${config.button}</button>
      </div>
    </div>
  `;
}

function qrMarkup(seed, color, withLogo) {
  return `
    <div class="qr-wrap" role="img" aria-label="示例二维码">
      ${qrSvg(seed, color)}
      ${withLogo ? `<span class="qr-logo">T</span>` : ""}
    </div>
  `;
}

function qrSvg(seed, color) {
  const size = 25;
  const quiet = 2;
  const total = size + quiet * 2;
  const modules = [];

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const finder = finderModule(x, y);
      const on = finder === null ? hashModule(x, y, seed) : finder;
      if (on) {
        modules.push(`<rect x="${x + quiet}" y="${y + quiet}" width="1" height="1" />`);
      }
    }
  }

  return `
    <svg viewBox="0 0 ${total} ${total}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-hidden="true">
      <rect width="${total}" height="${total}" fill="#fff" />
      <g fill="${color}">${modules.join("")}</g>
    </svg>
  `;
}

function finderModule(x, y) {
  const corners = [
    [0, 0],
    [18, 0],
    [0, 18],
  ];

  for (const [ox, oy] of corners) {
    if (x >= ox && x < ox + 7 && y >= oy && y < oy + 7) {
      const dx = x - ox;
      const dy = y - oy;
      return (
        dx === 0 ||
        dx === 6 ||
        dy === 0 ||
        dy === 6 ||
        (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4)
      );
    }
  }

  return null;
}

function hashModule(x, y, seed) {
  let value = (x + 17) * 73856093;
  value ^= (y + 29) * 19349663;
  value ^= (seed + 11) * 83492791;
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) & 255) < 118;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function titleForPage() {
  if (state.page === "home") return "天津大学";
  if (state.page === "records") return "记录";
  if (state.page === "profile") return "我的";
  if (state.page === "personal") return "个人信息";
  if (state.page === "payment") return "支付码";
  if (state.page === "auth") return "认证码";
  if (state.page === "recharge") return "充值";
  if (state.page === "service") return serviceConfig[state.serviceKey]?.title || "卡务中心";
  return "天津大学";
}

function screenMarkup() {
  if (state.page === "home") return homeMarkup();
  if (state.page === "records") return recordsMarkup();
  if (state.page === "profile") return profileMarkup();
  if (state.page === "personal") return personalMarkup();
  if (state.page === "payment") return paymentMarkup();
  if (state.page === "auth") return authMarkup();
  if (state.page === "recharge") return rechargeMarkup();
  if (state.page === "service") return serviceMarkup();
  return homeMarkup();
}

function render() {
  const tabPages = ["home", "records", "profile"];
  const showTab = tabPages.includes(state.page);
  const showBack = !tabPages.includes(state.page);

  app.innerHTML = `
    ${headerMarkup(titleForPage(), showBack)}
    <main class="screen-scroll ${showTab ? "" : "no-tab"}">${screenMarkup()}</main>
    ${showTab ? tabbarMarkup() : ""}
  `;

  if (state.page === "recharge") {
    const amountInput = document.getElementById("recharge-amount");
    amountInput?.addEventListener("input", (event) => {
      state.rechargeAmount = event.target.value;
    });
  }
}

function go(page, options = {}) {
  if (state.page !== page) {
    state.history.push(state.page);
  }
  state.page = page;
  if (options.serviceKey) {
    state.serviceKey = options.serviceKey;
  }
  closeModal();
  render();
}

function goTab(page) {
  state.page = page;
  state.history = [];
  closeModal();
  render();
}

function back() {
  state.page = state.history.length ? state.history.pop() : "home";
  closeModal();
  render();
}

function openModal(type) {
  state.modal = type;
  renderModal();
}

function closeModal() {
  state.modal = null;
  modalRoot.innerHTML = "";
}

function renderModal() {
  if (!state.modal) {
    modalRoot.innerHTML = "";
    return;
  }

  if (state.modal === "recharge-qr") {
    const amount = state.rechargeAmount || "50";
    modalRoot.innerHTML = `
      <div class="modal-backdrop" data-action="modal-close">
        <div class="modal-card" role="dialog" aria-modal="true" aria-label="充值二维码" data-modal-card>
          <div class="modal-title">充值</div>
          <div class="modal-amount">￥${escapeHtml(amount)}</div>
          <div class="modal-qr">${qrMarkup(state.qrSeed + 13, "#0757a6", true)}</div>
          <div class="modal-text">请使用微信支付扫码</div>
          <div class="modal-actions">
            <button class="modal-btn" type="button" data-action="modal-close">取消</button>
            <button class="modal-btn primary" type="button" data-action="modal-close">完成</button>
          </div>
        </div>
      </div>
    `;
    return;
  }

  if (state.modal === "service-confirm") {
    const config = serviceConfig[state.serviceKey] || serviceConfig.lost;
    modalRoot.innerHTML = `
      <div class="modal-backdrop" data-action="modal-close">
        <div class="modal-card" role="dialog" aria-modal="true" aria-label="确认操作" data-modal-card>
          <div class="modal-title">${config.title}</div>
          <div class="modal-text">是否确认提交当前信息？</div>
          <div class="modal-actions">
            <button class="modal-btn" type="button" data-action="modal-close">取消</button>
            <button class="modal-btn primary" type="button" data-action="confirm-service">确认</button>
          </div>
        </div>
      </div>
    `;
    return;
  }

  if (state.modal === "analysis") {
    modalRoot.innerHTML = `
      <div class="modal-backdrop" data-action="modal-close">
        <div class="modal-card" role="dialog" aria-modal="true" aria-label="收支分析" data-modal-card>
          <div class="modal-title">收支分析</div>
          <div class="analysis-chart" aria-hidden="true">
            ${[
              ["周一", 36],
              ["周二", 58],
              ["周三", 44],
              ["周四", 72],
              ["周五", 52],
              ["周六", 28],
              ["周日", 18],
            ]
              .map(
                ([label, height]) => `
                  <div class="analysis-bar">
                    <i style="height:${height}px"></i>
                    <span>${label}</span>
                  </div>
                `,
              )
              .join("")}
          </div>
          <div class="modal-text">本月消费 49.40 元</div>
          <div class="modal-actions">
            <button class="modal-btn primary" type="button" data-action="modal-close">关闭</button>
          </div>
        </div>
      </div>
    `;
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1600);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener("click", (event) => {
  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;

  const action = actionTarget.dataset.action;

  if (action === "tab") {
    goTab(actionTarget.dataset.page);
    return;
  }

  if (action === "go") {
    go(actionTarget.dataset.page);
    return;
  }

  if (action === "back") {
    back();
    return;
  }

  if (action === "service") {
    go("service", { serviceKey: actionTarget.dataset.service });
    return;
  }

  if (action === "record-tab") {
    state.recordTab = actionTarget.dataset.tab;
    render();
    return;
  }

  if (action === "analysis") {
    openModal("analysis");
    return;
  }

  if (action === "refresh-qr") {
    state.qrSeed = Date.now();
    render();
    return;
  }

  if (action === "amount") {
    state.rechargeAmount = actionTarget.dataset.amount;
    render();
    return;
  }

  if (action === "pay-method") {
    state.rechargeMethod = actionTarget.dataset.method;
    render();
    return;
  }

  if (action === "open-recharge-qr") {
    openModal("recharge-qr");
    return;
  }

  if (action === "service-confirm") {
    openModal("service-confirm");
    return;
  }

  if (action === "confirm-service") {
    closeModal();
    showToast("操作已提交");
    return;
  }

  if (action === "logout") {
    showToast("已退出登录");
    return;
  }

  if (action === "modal-close") {
    if (event.target.closest("[data-modal-card]") && actionTarget.classList.contains("modal-backdrop")) {
      return;
    }
    closeModal();
  }
});

render();

if ("serviceWorker" in navigator && /^https?:$/.test(window.location.protocol)) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
