import { Decision, Language, UserAction } from '../types';

export interface TranslationStrings {
  appName: string;
  appSubtitle: string;
  tagline: string;
  liveBadge: string;
  usualSpendBaseline: string;

  // Presets
  presetsLabel: string;
  presetNormal: string;
  presetNormalDesc: string;
  presetSuspicious: string;
  presetSuspiciousDesc: string;
  presetHighRisk: string;
  presetHighRiskDesc: string;

  // Form Fields
  payeeUpiLabel: string;
  payeeUpiPlaceholder: string;
  amountLabel: string;
  amountPlaceholder: string;
  timeOfDayLabel: string;
  timeOfDayHint: string;
  newPayeeLabel: string;
  newPayeeSub: string;
  newDeviceLabel: string;
  newDeviceSub: string;
  unusualLocationLabel: string;
  unusualLocationSub: string;
  languageLabel: string;
  payButton: string;
  evaluatingButton: string;
  yes: string;
  no: string;

  // Decision Views
  decisionAllowTitle: string;
  decisionAllowSubtitle: string;
  decisionAllowMessage: string;
  allowProceedButton: string;

  decisionWarnTitle: string;
  decisionWarnSubtitle: string;
  decisionWarnMessage: string;
  warnProceedButton: string;
  warnCancelButton: string;

  decisionBlockTitle: string;
  decisionBlockSubtitle: string;
  decisionBlockMessage: string;
  blockRecommendedAction: string;
  blockCancelButton: string;
  blockOverrideButton: string;
  blockOverrideCheckbox: string;
  blockOverrideNotice: string;

  // XAI Explanations
  topReasonsHeader: string;
  topReasonsSub: string;
  scoreContributionLabel: string;
  baselineContributionLabel: string;
  noRiskDetected: string;
  riskGaugeLabel: string;
  riskScoreTitle: string;
  modelLatencyLabel: string;
  safeZone: string;
  warningZone: string;
  dangerZone: string;

  // Stats & History
  statsHeading: string;
  totalEvaluated: string;
  allowedCount: string;
  warnedCount: string;
  blockedCount: string;
  avgResponseTime: string;
  historyTitle: string;
  historyEmpty: string;
  colPayee: string;
  colAmount: string;
  colScore: string;
  colDecision: string;
  colUserAction: string;
  colTime: string;
  clearHistory: string;

  // Pin & Success Dialogs
  enterUpiPinTitle: string;
  enterUpiPinDesc: string;
  upiPinSubmit: string;
  upiPinCancel: string;
  paymentSuccessTitle: string;
  paymentSuccessMessage: string;
  paymentCancelledTitle: string;
  paymentCancelledMessage: string;
  doneButton: string;

  // Decision badges
  decisionAllowBadge: string;
  decisionWarnBadge: string;
  decisionBlockBadge: string;

  // User Actions
  actionApproved: string;
  actionProceededAfterWarn: string;
  actionCancelledAfterWarn: string;
  actionBlockedByUser: string;
  actionOverridden: string;
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    appName: "ExplainPay",
    appSubtitle: "Explainable AI for Real-Time UPI Fraud Alerts",
    tagline: "Empowering UPI payments with transparent, instant risk explanations",
    liveBadge: "Active Protection",
    usualSpendBaseline: "User Spending Baseline: ₹2,000 / tx",

    // Presets
    presetsLabel: "Quick Test Scenarios",
    presetNormal: "Normal Payment",
    presetNormalDesc: "Grocery merchant · ₹450 · Regular phone & hours",
    presetSuspicious: "Suspicious Payment",
    presetSuspiciousDesc: "New seller · ₹14,500 (7x) · Unfamiliar city",
    presetHighRisk: "High-Risk Payment",
    presetHighRiskDesc: "Unknown party · ₹48,000 (24x) · 3:00 AM · New device",

    // Form Fields
    payeeUpiLabel: "Payee UPI ID",
    payeeUpiPlaceholder: "e.g. rahul@oksbi or merchant@paytm",
    amountLabel: "Payment Amount (₹)",
    amountPlaceholder: "Amount in Rupees",
    timeOfDayLabel: "Time of Day",
    timeOfDayHint: "Simulate transaction hour (12 AM - 5 AM classified as high risk)",
    newPayeeLabel: "First Time Paying This UPI ID?",
    newPayeeSub: "Recipient not in your saved or historical contacts",
    newDeviceLabel: "Payment From a New Device?",
    newDeviceSub: "Device fingerprint does not match regular handset",
    unusualLocationLabel: "Payment From an Unusual Location?",
    unusualLocationSub: "IP / GPS coordinates deviate >200km from home circle",
    languageLabel: "Language / भाषा",
    payButton: "Analyze & Pay via UPI",
    evaluatingButton: "Analyzing via Explainable AI...",
    yes: "Yes",
    no: "No",

    // Decision Views
    decisionAllowTitle: "Payment Verified Safe",
    decisionAllowSubtitle: "Risk Score: Low · 0 to 40 Threshold",
    decisionAllowMessage: "No significant fraud patterns detected. The transaction matches your historical behavioral baseline.",
    allowProceedButton: "Authorize & Send ₹",

    decisionWarnTitle: "Caution: Suspicious Signals Detected",
    decisionWarnSubtitle: "Risk Score: Moderate · 41 to 75 Threshold",
    decisionWarnMessage: "This payment deviates from your normal patterns. Review the 3 primary drivers below before proceeding.",
    warnProceedButton: "Proceed Anyway",
    warnCancelButton: "Cancel Payment",

    decisionBlockTitle: "High Fraud Risk: Block Recommended",
    decisionBlockSubtitle: "Risk Score: Severe · 76 to 100 Threshold",
    decisionBlockMessage: "ExplainPay strongly advises blocking this transaction. It exhibits critical characteristics of active UPI scams.",
    blockRecommendedAction: "Recommended Action: Abort transaction to safeguard funds",
    blockCancelButton: "Block & Protect Money (Recommended)",
    blockOverrideButton: "Confirm Override & Pay",
    blockOverrideCheckbox: "I accept full personal responsibility for this transfer and confirm this is not a scam or coercion.",
    blockOverrideNotice: "Override requires safety acknowledgment and re-entry of security PIN.",

    // XAI Explanations
    topReasonsHeader: "Top Risk Contributors",
    topReasonsSub: "Explainable feature attributions calibrated to your spending profile",
    scoreContributionLabel: "Impact",
    baselineContributionLabel: "Baseline risk factor",
    noRiskDetected: "All fraud indicators passed. Payment parameters align with regular profile.",
    riskGaugeLabel: "Explainable Risk Meter",
    riskScoreTitle: "Fraud Risk Score",
    modelLatencyLabel: "Inference Latency",
    safeZone: "Safe (0-40)",
    warningZone: "Warning (41-75)",
    dangerZone: "Critical (76-100)",

    // Stats & History
    statsHeading: "Live Monitoring Telemetry",
    totalEvaluated: "Total Evaluated",
    allowedCount: "Allowed (Safe)",
    warnedCount: "Warned",
    blockedCount: "Blocked / High-Risk",
    avgResponseTime: "Avg Response Time",
    historyTitle: "Transaction History & Audit Trail",
    historyEmpty: "No transactions processed yet. Run a scenario above!",
    colPayee: "Payee UPI",
    colAmount: "Amount",
    colScore: "Risk Score",
    colDecision: "Decision",
    colUserAction: "User Action",
    colTime: "Time / Latency",
    clearHistory: "Clear Audit Log",

    // Pin & Success Dialogs
    enterUpiPinTitle: "Enter 6-Digit UPI PIN",
    enterUpiPinDesc: "Secured by Bank Virtual Private Network",
    upiPinSubmit: "Submit & Authorize",
    upiPinCancel: "Cancel",
    paymentSuccessTitle: "Payment Successful!",
    paymentSuccessMessage: "Funds successfully debited and transferred via UPI.",
    paymentCancelledTitle: "Payment Cancelled Safely",
    paymentCancelledMessage: "Your funds remain safe in your bank account. Alert recorded.",
    doneButton: "Done",

    // Decision badges
    decisionAllowBadge: "ALLOW",
    decisionWarnBadge: "WARN",
    decisionBlockBadge: "BLOCK",

    // User Actions
    actionApproved: "Approved (Instant)",
    actionProceededAfterWarn: "Proceeded after warning",
    actionCancelledAfterWarn: "Cancelled by user (Caution)",
    actionBlockedByUser: "Blocked & protected",
    actionOverridden: "Overridden with PIN",
  },

  hi: {
    appName: "ExplainPay",
    appSubtitle: "रीयल-टाइम यूपीआई धोखाधड़ी अलर्ट के लिए एक्सप्लेनेबल एआई",
    tagline: "पारदर्शी और तुरंत जोखिम व्याख्या के साथ सुरक्षित यूपीआई भुगतान",
    liveBadge: "सक्रिय सुरक्षा",
    usualSpendBaseline: "उपयोगकर्ता सामान्य खर्च: ₹2,000 / लेनदेन",

    // Presets
    presetsLabel: "त्वरित परीक्षण परिदृश्य",
    presetNormal: "सामान्य भुगतान",
    presetNormalDesc: "किराना दुकान · ₹450 · नियमित फोन और समय",
    presetSuspicious: "संदेहास्पद भुगतान",
    presetSuspiciousDesc: "नया विक्रेता · ₹14,500 (7 गुना) · अपरिचित शहर",
    presetHighRisk: "उच्च-जोखिम भुगतान",
    presetHighRiskDesc: "अज्ञात व्यक्ति · ₹48,000 (24 गुना) · रात 3:00 बजे · नया फोन",

    // Form Fields
    payeeUpiLabel: "प्राप्तकर्ता की यूपीआई आईडी (UPI ID)",
    payeeUpiPlaceholder: "उदा. rahul@oksbi या merchant@paytm",
    amountLabel: "भुगतान राशि (₹)",
    amountPlaceholder: "रुपयों में राशि",
    timeOfDayLabel: "दिन का समय (घंटे)",
    timeOfDayHint: "लेनदेन का समय (रात 12 बजे से सुबह 5 बजे उच्च जोखिम)",
    newPayeeLabel: "क्या यह इस यूपीआई आईडी को पहला भुगतान है?",
    newPayeeSub: "प्राप्तकर्ता आपके पुराने संपर्क या इतिहास में नहीं है",
    newDeviceLabel: "क्या नए डिवाइस (फोन/टैबलेट) से भुगतान हो रहा है?",
    newDeviceSub: "डिवाइस पहचान आपके नियमित फोन से मेल नहीं खाती",
    unusualLocationLabel: "क्या असामान्य स्थान से भुगतान हो रहा है?",
    unusualLocationSub: "जीपीएस/इंटरनेट लोकेशन सामान्य क्षेत्र से 200 किमी से अधिक दूर है",
    languageLabel: "भाषा / Language",
    payButton: "जोखिम जांचें और भुगतान करें",
    evaluatingButton: "एआई द्वारा जोखिम विश्लेषण जारी है...",
    yes: "हाँ",
    no: "नहीं",

    // Decision Views
    decisionAllowTitle: "भुगतान पूर्णतः सुरक्षित है",
    decisionAllowSubtitle: "जोखिम स्कोर: कम · 0 से 40 सीमा",
    decisionAllowMessage: "धोखाधड़ी का कोई संकेत नहीं मिला। यह लेनदेन आपके सामान्य खर्च व्यवहार के अनुसार है।",
    allowProceedButton: "पुष्टि करें और ₹ भेजें",

    decisionWarnTitle: "सावधानी: संदिग्ध संकेत मिले हैं",
    decisionWarnSubtitle: "जोखिम स्कोर: मध्यम · 41 से 75 सीमा",
    decisionWarnMessage: "यह भुगतान आपके सामान्य व्यवहार से भिन्न है। आगे बढ़ने से पहले नीचे दिए गए 3 मुख्य कारणों की समीक्षा करें।",
    warnProceedButton: "फिर भी आगे बढ़ें",
    warnCancelButton: "भुगतान रद्द करें",

    decisionBlockTitle: "अत्यधिक जोखिम: भुगतान रोकना अनुशंसित",
    decisionBlockSubtitle: "जोखिम स्कोर: गंभीर · 76 से 100 सीमा",
    decisionBlockMessage: "ExplainPay इस लेनदेन को तुरंत रोकने की सलाह देता है। इसमें यूपीआई साइबर धोखाधड़ी के गंभीर लक्षण हैं।",
    blockRecommendedAction: "अनुशंसित कार्रवाई: पैसे सुरक्षित रखने के लिए लेनदेन रद्द करें",
    blockCancelButton: "रोकें और पैसे बचाएं (अनुशंसित)",
    blockOverrideButton: "जोखिम स्वीकार कर भुगतान करें",
    blockOverrideCheckbox: "मैं इस लेनदेन की पूरी व्यक्तिगत जिम्मेदारी लेता हूँ और पुष्टि करता हूँ कि यह कोई धोखा या दबाव नहीं है।",
    blockOverrideNotice: "आगे बढ़ने के लिए सुरक्षा स्वीकृति और यूपीआई पिन दर्ज करना अनिवार्य है।",

    // XAI Explanations
    topReasonsHeader: "जोखिम बढ़ाने वाले शीर्ष 3 कारण",
    topReasonsSub: "आपके खर्च प्रोफाइल के आधार पर पारदर्शी एआई विश्लेषण",
    scoreContributionLabel: "प्रभाव",
    baselineContributionLabel: "सामान्य आधार जोखिम",
    noRiskDetected: "सभी सुरक्षा परीक्षण सफल रहे। कोई जोखिम नहीं मिला।",
    riskGaugeLabel: "एआई जोखिम मीटर",
    riskScoreTitle: "धोखाधड़ी जोखिम स्कोर",
    modelLatencyLabel: "विश्लेषण समय",
    safeZone: "सुरक्षित (0-40)",
    warningZone: "चेतावनी (41-75)",
    dangerZone: "गंभीर (76-100)",

    // Stats & History
    statsHeading: "लाइव सुरक्षा टेलीमेट्री",
    totalEvaluated: "कुल विश्लेषित",
    allowedCount: "स्वीकृत (सुरक्षित)",
    warnedCount: "चेतावनी",
    blockedCount: "अवरुद्ध (उच्च जोखिम)",
    avgResponseTime: "औसत प्रतिक्रिया समय",
    historyTitle: "लेनदेन इतिहास एवं ऑडिट लॉग",
    historyEmpty: "अभी तक कोई लेनदेन नहीं हुआ। ऊपर दिए गए परिदृश्य का परीक्षण करें!",
    colPayee: "प्राप्तकर्ता यूपीआई",
    colAmount: "राशि",
    colScore: "जोखिम स्कोर",
    colDecision: "निर्णय",
    colUserAction: "आपकी कार्रवाई",
    colTime: "समय / लेटेंसी",
    clearHistory: "इतिहास साफ़ करें",

    // Pin & Success Dialogs
    enterUpiPinTitle: "अपना 6-अंकीय यूपीआई पिन दर्ज करें",
    enterUpiPinDesc: "बैंक के सुरक्षित नेटवर्क द्वारा एन्क्रिप्टेड",
    upiPinSubmit: "पिन जमा करें",
    upiPinCancel: "रद्द करें",
    paymentSuccessTitle: "भुगतान सफल रहा!",
    paymentSuccessMessage: "राशि आपके खाते से सुरक्षित रूप से स्थानांतरित कर दी गई है।",
    paymentCancelledTitle: "भुगतान सुरक्षित रूप से रद्द किया गया",
    paymentCancelledMessage: "आपके पैसे आपके बैंक खाते में सुरक्षित हैं। अलर्ट दर्ज किया गया।",
    doneButton: "संपन्न",

    // Decision badges
    decisionAllowBadge: "स्वीकृत",
    decisionWarnBadge: "चेतावनी",
    decisionBlockBadge: "अवरुद्ध",

    // User Actions
    actionApproved: "तुरंत स्वीकृत",
    actionProceededAfterWarn: "चेतावनी के बाद भी भुगतान किया",
    actionCancelledAfterWarn: "सावधानीपूर्वक रद्द किया",
    actionBlockedByUser: "अवरुद्ध किया (सुरक्षित)",
    actionOverridden: "पिन से जबरन भुगतान",
  },

  mr: {
    appName: "ExplainPay",
    appSubtitle: "रिअल-टाइम युपीआय फसवणूक अलर्टसाठी स्पष्टीकरणात्मक एआय (XAI)",
    tagline: "पारदर्शक आणि त्वरित जोखीम विश्लेषणासह सुरक्षित UPI देयके",
    liveBadge: "सक्रिय संरक्षण",
    usualSpendBaseline: "वापरकर्त्याचा सरासरी खर्च: ₹2,000 / व्यवहार",

    // Presets
    presetsLabel: "चाचणीसाठी परिस्थिती निवडा",
    presetNormal: "सामान्य पेमेंट",
    presetNormalDesc: "किराणा दुकान · ₹450 · नियमित फोन आणि वेळ",
    presetSuspicious: "संशयास्पद पेमेंट",
    presetSuspiciousDesc: "नवीन विक्रेता · ₹14,500 (7 पट) · अनोळखी शहर",
    presetHighRisk: "अति-धोकादायक पेमेंट",
    presetHighRiskDesc: "अनोळखी व्यक्ती · ₹48,000 (24 पट) · पहाटे 3:00 वाजता · नवीन फोन",

    // Form Fields
    payeeUpiLabel: "प्राप्तकर्त्याचा UPI ID",
    payeeUpiPlaceholder: "उदा. rahul@oksbi किंवा merchant@paytm",
    amountLabel: "पेमेंट रक्कम (₹)",
    amountPlaceholder: "रुपयांमध्ये रक्कम",
    timeOfDayLabel: "दिवसाची वेळ (तास)",
    timeOfDayHint: "व्यवहाराची वेळ (रात्री 12 ते पहाटे 5 वाजेपर्यंत उच्च धोका मानला जातो)",
    newPayeeLabel: "या UPI ID वर पहिल्यांदाच पैसे पाठवत आहात का?",
    newPayeeSub: "प्राप्तकर्ता तुमच्या सेव्ह केलेल्या संपर्कांमध्ये नाही",
    newDeviceLabel: "नवीन डिव्हाइसवरून पेमेंट केले जात आहे का?",
    newDeviceSub: "डिव्हाइसची ओळख तुमच्या नेहमीच्या फोनशी जुळत नाही",
    unusualLocationLabel: "अपरिचित ठिकाणाहून पेमेंट केले जात आहे का?",
    unusualLocationSub: "स्थान तुमच्या नेहमीच्या क्षेत्रापेक्षा 200 किमीपेक्षा जास्त दूर आहे",
    languageLabel: "भाषा / Language",
    payButton: "जोखीम तपासा आणि पेमेंट करा",
    evaluatingButton: "एआय जोखीम तपासणी सुरू आहे...",
    yes: "होय",
    no: "नाही",

    // Decision Views
    decisionAllowTitle: "पेमेंट पूर्णपणे सुरक्षित आहे",
    decisionAllowSubtitle: "जोखीम स्कोअर: कमी · 0 ते 40 मर्यादा",
    decisionAllowMessage: "कोणताही फसवणुकीचा धोका आढळला नाही. हा व्यवहार तुमच्या नियमित खर्चाशी सुसंगत आहे.",
    allowProceedButton: "मंजूर करा आणि ₹ पाठवा",

    decisionWarnTitle: "सावधान: संशयास्पद बाबी आढळल्या आहेत",
    decisionWarnSubtitle: "जोखीम स्कोअर: मध्यम · 41 ते 75 मर्यादा",
    decisionWarnMessage: "हे पेमेंट तुमच्या नेहमीच्या पद्धतीपेक्षा वेगळे आहे. पुढे जाण्यापूर्वी खालील 3 मुख्य कारणे तपासा.",
    warnProceedButton: "तरीही पुढे जा",
    warnCancelButton: "पेमेंट रद्द करा",

    decisionBlockTitle: "अति-धोकादायक: पेमेंट रोखण्याची शिफारस",
    decisionBlockSubtitle: "जोखीम स्कोअर: गंभीर · 76 ते 100 मर्यादा",
    decisionBlockMessage: "ExplainPay हा व्यवहार त्वरित रोखण्याचा ठाम सल्ला देते. यामध्ये सायबर फसवणुकीची स्पष्ट लक्षणे आहेत.",
    blockRecommendedAction: "शिफारस केलेली कृती: पैसे सुरक्षित ठेवण्यासाठी व्यवहार रद्द करा",
    blockCancelButton: "रोखा आणि पैसे वाचवा (शिफारस केलेले)",
    blockOverrideButton: "धोका मान्य करून पेमेंट करा",
    blockOverrideCheckbox: "मी या व्यवहाराची पूर्ण वैयक्तिक जबाबदारी घेतो आणि खात्री करतो की ही कोणतीही फसवणूक नाही.",
    blockOverrideNotice: "पुढे जाण्यासाठी सुरक्षेची हमी देणे आणि UPI पिन टाकणे अनिवार्य आहे.",

    // XAI Explanations
    topReasonsHeader: "जोखीम वाढवणारी प्रमुख 3 कारणे",
    topReasonsSub: "तुमच्या खर्च प्रोफाईलवर आधारित पारदर्शक एआय स्पष्टीकरण",
    scoreContributionLabel: "प्रभाव",
    baselineContributionLabel: "पायाभूत जोखीम घटक",
    noRiskDetected: "सर्व सुरक्षा निकष पूर्ण झाले. कोणताही धोका आढळला नाही.",
    riskGaugeLabel: "एआय जोखीम मीटर",
    riskScoreTitle: "फसवणूक जोखीम स्कोअर",
    modelLatencyLabel: "विश्लेषण वेळ",
    safeZone: "सुरक्षित (0-40)",
    warningZone: "इशारा (41-75)",
    dangerZone: "गंभीर (76-100)",

    // Stats & History
    statsHeading: "रिअल-टाइम सुरक्षा आकडेवारी",
    totalEvaluated: "एकूण तपासलेले",
    allowedCount: "मंजूर (सुरक्षित)",
    warnedCount: "इशारा दिला",
    blockedCount: "रोखलेले (गंभीर)",
    avgResponseTime: "सरासरी प्रतिसाद वेळ",
    historyTitle: "व्यवहार इतिहास आणि ऑडिट नोंद",
    historyEmpty: "अद्याप कोणताही व्यवहार झालेला नाही. वरील चाचणी वापरा!",
    colPayee: "प्राप्तकर्ता UPI",
    colAmount: "रक्कम",
    colScore: "जोखीम स्कोअर",
    colDecision: "निर्णय",
    colUserAction: "तुमची कृती",
    colTime: "वेळ / लेटन्सी",
    clearHistory: "इतिहास साफ करा",

    // Pin & Success Dialogs
    enterUpiPinTitle: "तुमचा 6-अंकी UPI पिन टाका",
    enterUpiPinDesc: "बँकेच्या सुरक्षित नेटवर्कद्वारे संरक्षित",
    upiPinSubmit: "पिन सबमिट करा",
    upiPinCancel: "रद्द करा",
    paymentSuccessTitle: "पेमेंट यशस्वी झाले!",
    paymentSuccessMessage: "रक्कम तुमच्या खात्यातून यशस्वीरित्या हस्तांतरित झाली आहे.",
    paymentCancelledTitle: "पेमेंट सुरक्षितपणे रद्द केले",
    paymentCancelledMessage: "तुमचे पैसे तुमच्या बँक खात्यात सुरक्षित आहेत. अलर्ट नोंदवला गेला.",
    doneButton: "पूर्ण झाले",

    // Decision badges
    decisionAllowBadge: "मंजूर",
    decisionWarnBadge: "इशारा",
    decisionBlockBadge: "रोखले",

    // User Actions
    actionApproved: "त्वरित मंजूर",
    actionProceededAfterWarn: "इशार्यानंतरही पाठवले",
    actionCancelledAfterWarn: "सावधगिरीने रद्द केले",
    actionBlockedByUser: "रोखले (संरक्षित)",
    actionOverridden: "पिनने सक्तीने पाठवले",
  },
};

export function getActionText(action: UserAction, lang: Language): string {
  switch (action) {
    case 'APPROVED':
      return translations[lang].actionApproved;
    case 'PROCEEDED_AFTER_WARN':
      return translations[lang].actionProceededAfterWarn;
    case 'CANCELLED_AFTER_WARN':
      return translations[lang].actionCancelledAfterWarn;
    case 'BLOCKED_BY_USER':
      return translations[lang].actionBlockedByUser;
    case 'OVERRIDDEN_AND_PAID':
      return translations[lang].actionOverridden;
  }
}

export function getDecisionBadge(decision: Decision, lang: Language): { text: string; bg: string; textCol: string; border: string } {
  switch (decision) {
    case 'ALLOW':
      return {
        text: translations[lang].decisionAllowBadge,
        bg: 'bg-emerald-500/15',
        textCol: 'text-emerald-400',
        border: 'border-emerald-500/30',
      };
    case 'WARN':
      return {
        text: translations[lang].decisionWarnBadge,
        bg: 'bg-amber-500/15',
        textCol: 'text-amber-400',
        border: 'border-amber-500/30',
      };
    case 'BLOCK':
      return {
        text: translations[lang].decisionBlockBadge,
        bg: 'bg-rose-500/15',
        textCol: 'text-rose-400',
        border: 'border-rose-500/30',
      };
  }
}
