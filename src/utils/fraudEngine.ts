import { Decision, PaymentFormValues, RiskEvaluation, RiskFactor } from '../types';

export const BASELINE_SPEND = 2000;

function formatMultiplier(ratio: number, lang: 'en' | 'hi' | 'mr' = 'en'): string {
  const rounded = Math.round(ratio * 10) / 10;
  if (lang === 'hi') {
    return `${rounded} गुना`;
  }
  if (lang === 'mr') {
    return `${rounded} पट`;
  }
  return `${rounded}x`;
}

function formatHour(hour: number, lang: 'en' | 'hi' | 'mr' = 'en'): string {
  const period = hour >= 12 ? (lang === 'en' ? 'PM' : 'दोपहर/शाम') : (lang === 'en' ? 'AM' : 'रात/सुबह');
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}:00 ${period}`;
}

export function evaluatePaymentRisk(values: PaymentFormValues): RiskEvaluation {
  const startTime = performance.now();
  const factors: RiskFactor[] = [];
  const basePoints = 4;

  const ratio = values.amount / BASELINE_SPEND;

  // 1. Amount Risk
  if (values.amount > BASELINE_SPEND) {
    let amountPoints = 0;
    if (ratio <= 2) {
      amountPoints = 8;
    } else if (ratio <= 4) {
      amountPoints = 16;
    } else if (ratio <= 8) {
      amountPoints = 28;
    } else if (ratio <= 15) {
      amountPoints = 36;
    } else {
      amountPoints = 44;
    }

    factors.push({
      id: 'amount_anomaly',
      name: 'High Transaction Value',
      category: 'amount',
      points: amountPoints,
      relativeWeight: Math.min(amountPoints * 2, 90),
      explanation: {
        en: `This amount is ${formatMultiplier(ratio, 'en')} your usual spending (₹${values.amount.toLocaleString('en-IN')} vs avg ₹${BASELINE_SPEND.toLocaleString('en-IN')}).`,
        hi: `यह राशि आपके सामान्य खर्च से ${formatMultiplier(ratio, 'hi')} अधिक है (₹${values.amount.toLocaleString('en-IN')} बनाम औसत ₹${BASELINE_SPEND.toLocaleString('en-IN')})।`,
        mr: `ही रक्कम तुमच्या नेहमीच्या खर्चापेक्षा ${formatMultiplier(ratio, 'mr')} जास्त आहे (₹${values.amount.toLocaleString('en-IN')} विरूद्ध सरासरी ₹${BASELINE_SPEND.toLocaleString('en-IN')}).`,
      },
      detailNote: {
        en: `Historical average is ₹${BASELINE_SPEND.toLocaleString('en-IN')}. Significant standard deviation detected.`,
        hi: `ऐतिहासिक औसत ₹${BASELINE_SPEND.toLocaleString('en-IN')} है। महत्वपूर्ण विचलन पाया गया।`,
        mr: `ऐतिहासिक सरासरी ₹${BASELINE_SPEND.toLocaleString('en-IN')} आहे. मोठा फरक आढळला.`,
      },
    });
  }

  // 2. New Payee Risk
  if (values.isNewPayee) {
    factors.push({
      id: 'new_payee',
      name: 'First-Time Recipient',
      category: 'payee',
      points: 22,
      relativeWeight: 45,
      explanation: {
        en: 'You have never paid this recipient before.',
        hi: 'आपने इस प्राप्तकर्ता को पहले कभी भुगतान नहीं किया है।',
        mr: 'तुम्ही या प्राप्तकर्त्याला यापूर्वी कधीही पैसे पाठवलेले नाहीत.',
      },
      detailNote: {
        en: 'Unfamiliar UPI address not listed in past 180 days of ledger.',
        hi: 'अपरिचित यूपीआई पता पिछले 180 दिनों के रिकॉर्ड में नहीं है।',
        mr: 'गेल्या 180 दिवसांच्या नोंदींमध्ये हा UPI आयडी आढळला नाही.',
      },
    });
  }

  // 3. Odd Hours Risk (12:00 AM to 4:59 AM)
  const isOddHour = values.hour >= 0 && values.hour <= 4;
  if (isOddHour) {
    factors.push({
      id: 'odd_hour',
      name: 'Unusual Transaction Time',
      category: 'timing',
      points: 18,
      relativeWeight: 38,
      explanation: {
        en: `This payment is at an unusual hour (${formatHour(values.hour, 'en')}).`,
        hi: `यह भुगतान असामान्य समय (${formatHour(values.hour, 'hi')}) पर किया जा रहा है।`,
        mr: `हे पेमेंट एका असामान्य वेळी (${formatHour(values.hour, 'mr')}) केले जात आहे.`,
      },
      detailNote: {
        en: 'Late night window (12 AM - 5 AM) is historically prone to unauthorized access.',
        hi: 'देर रात की समय-सीमा (रात 12 - सुबह 5) में साइबर धोखाधड़ी का उच्च जोखिम होता है।',
        mr: 'मध्यरात्रीची वेळ (रात्री 12 ते पहाटे 5) फसवणुकीच्या दृष्टीने संवेदनशील मानली जाते.',
      },
    });
  }

  // 4. New Device Risk
  if (values.isNewDevice) {
    factors.push({
      id: 'new_device',
      name: 'Unrecognized Device Fingerprint',
      category: 'device',
      points: 20,
      relativeWeight: 42,
      explanation: {
        en: 'This payment is from a new device.',
        hi: 'यह भुगतान एक नए डिवाइस से किया जा रहा है।',
        mr: 'हे पेमेंट एका नवीन उपकरणावरून (Device) केले जात आहे.',
      },
      detailNote: {
        en: 'Hardware UUID and SIM binding not seen in prior user sessions.',
        hi: 'हार्डवेयर पहचान और सिम बाइंडिंग पूर्व सत्रों में सत्यापित नहीं है।',
        mr: 'या डिव्हाइसची नोंद पूर्वीच्या सत्रांमध्ये आढळलेली नाही.',
      },
    });
  }

  // 5. Unusual Location Risk
  if (values.isUnusualLocation) {
    factors.push({
      id: 'unusual_location',
      name: 'Anomalous Geolocation',
      category: 'location',
      points: 18,
      relativeWeight: 36,
      explanation: {
        en: 'This payment is from an unusual location.',
        hi: 'यह भुगतान एक असामान्य स्थान से किया जा रहा है।',
        mr: 'हे पेमेंट एका अपरिचित ठिकाणावरून केले जात आहे.',
      },
      detailNote: {
        en: 'Cell tower & IP geolocation exceeds 200km radius of habitual zone.',
        hi: 'सेल टॉवर और आईपी स्थान आपके सामान्य क्षेत्र से 200 किमी दूर है।',
        mr: 'सेल टॉवर आणि आयपी लोकेशन नेहमीच्या क्षेत्रापेक्षा 200 किमी दूर आहे.',
      },
    });
  }

  // 6. Combinations synergy penalties
  if (values.isNewPayee && values.amount >= 6000 && isOddHour) {
    factors.push({
      id: 'synergy_high_night_new',
      name: 'High-Risk Compound Vector',
      category: 'synergy',
      points: 15,
      relativeWeight: 40,
      explanation: {
        en: 'High amount combined with a new payee at late night hours.',
        hi: 'देर रात में नए प्राप्तकर्ता को उच्च राशि का असामान्य संयोजन।',
        mr: 'रात्रीच्या वेळी नवीन प्राप्तकर्त्याला मोठी रक्कम पाठवण्याचा उच्च धोका.',
      },
      detailNote: {
        en: 'Common pattern in social engineering and urgent OTP extortion scams.',
        hi: 'सोशल इंजीनियरिंग और साइबर ठगी में यह पैटर्न सामान्यतः देखा जाता है।',
        mr: 'सायबर फसवणूक आणि तातडीच्या फसव्या कॉल्समध्ये हा पॅटर्न दिसून येतो.',
      },
    });
  } else if (values.isNewDevice && values.isUnusualLocation && values.isNewPayee) {
    factors.push({
      id: 'synergy_takeover',
      name: 'Account Takeover Profile',
      category: 'synergy',
      points: 14,
      relativeWeight: 38,
      explanation: {
        en: 'Simultaneous new device, remote location, and first-time beneficiary.',
        hi: 'एक साथ नया डिवाइस, दूरस्थ स्थान और पहली बार प्राप्तकर्ता।',
        mr: 'एकाच वेळी नवीन डिव्हाइस, दूरचे ठिकाण आणि नवीन लाभार्थी.',
      },
      detailNote: {
        en: 'Signature indicators consistent with SIM swap or remote session hijack.',
        hi: 'सिम स्वैप या रिमोट सत्र अपहरण जैसे गंभीर लक्षण।',
        mr: 'सिम स्वॅप किंवा अनधिकृत प्रवेशासारखी धोक्याची चिन्हे.',
      },
    });
  } else if (values.isNewDevice && values.isUnusualLocation) {
    factors.push({
      id: 'synergy_device_loc',
      name: 'Untrusted Environment Matrix',
      category: 'synergy',
      points: 10,
      relativeWeight: 26,
      explanation: {
        en: 'Co-occurrence of unrecognized hardware and unfamiliar geo-IP zone.',
        hi: 'अपरिचित हार्डवेयर और असामान्य स्थान का एक साथ होना।',
        mr: 'अनोळखी हार्डवेअर आणि अपरिचित ठिकाण एकाच वेळी आढळणे.',
      },
      detailNote: {
        en: 'Elevates likelihood of external network interception.',
        hi: 'बाहरी नेटवर्क हस्तक्षेप की संभावना को बढ़ाता है।',
        mr: 'अनधिकृत हस्तक्षेपाची शक्यता वाढवते.',
      },
    });
  }

  // Sum points
  const rawSum = basePoints + factors.reduce((acc, curr) => acc + curr.points, 0);
  const score = Math.min(100, Math.max(0, Math.round(rawSum)));

  // Determine decision
  let decision: Decision = 'ALLOW';
  if (score >= 76) {
    decision = 'BLOCK';
  } else if (score >= 41) {
    decision = 'WARN';
  } else {
    decision = 'ALLOW';
  }

  // Sort factors by points descending
  const sortedFactors = [...factors].sort((a, b) => b.points - a.points);
  const topReasons = sortedFactors.slice(0, 3);

  // If no risk factors (very safe transaction), add a safe baseline reassurance
  if (topReasons.length === 0) {
    topReasons.push({
      id: 'amount_safe',
      name: 'Historical Normal Amount',
      category: 'amount',
      points: 2,
      relativeWeight: 5,
      explanation: {
        en: `Amount (₹${values.amount.toLocaleString('en-IN')}) is safely within your ₹${BASELINE_SPEND.toLocaleString('en-IN')} average.`,
        hi: `राशि (₹${values.amount.toLocaleString('en-IN')}) आपके ₹${BASELINE_SPEND.toLocaleString('en-IN')} के सामान्य दायरे में है।`,
        mr: `रक्कम (₹${values.amount.toLocaleString('en-IN')}) तुमच्या ₹${BASELINE_SPEND.toLocaleString('en-IN')} च्या सरासरी मर्यादेत आहे.`,
      },
    });
    topReasons.push({
      id: 'device_safe',
      name: 'Trusted Primary Device',
      category: 'device',
      points: 1,
      relativeWeight: 2,
      explanation: {
        en: 'Transaction initiated from your recognized daily phone.',
        hi: 'लेनदेन आपके नियमित प्रमाणित फोन से शुरू किया गया है।',
        mr: 'व्यवहार तुमच्या नेहमीच्या प्रमाणित फोनवरून सुरू केला आहे.',
      },
    });
  }

  // Simulate ultra-fast real-time inference latency (16ms to 28ms)
  const execTime = performance.now() - startTime;
  const simulatedLatency = Math.round(18 + (Math.random() * 10) + execTime);

  return {
    score,
    decision,
    responseTimeMs: simulatedLatency,
    topReasons,
    allFactors: factors,
    modelConfidence: Number((97.2 + (Math.random() * 2.5)).toFixed(1)),
    evaluatedAt: new Date().toISOString(),
    input: values,
  };
}

export const PRESET_SCENARIOS: Record<'normal' | 'suspicious' | 'high_risk', PaymentFormValues> = {
  normal: {
    payeeUpi: 'kirana.supermart@paytm',
    payeeName: 'Kirana Supermart',
    amount: 450,
    hour: 14, // 2:00 PM
    isNewPayee: false,
    isNewDevice: false,
    isUnusualLocation: false,
    notes: 'Weekly groceries',
  },
  suspicious: {
    payeeUpi: 'rajesh.gadgets@okicici',
    payeeName: 'Rajesh Electronics Store',
    amount: 14500, // 7.25x average
    hour: 18, // 6:00 PM
    isNewPayee: true,
    isNewDevice: false,
    isUnusualLocation: true,
    notes: 'Smart TV discount deal',
  },
  high_risk: {
    payeeUpi: 'urgent.prize99@ybl',
    payeeName: 'Lucky Draw Clearance Vault',
    amount: 48000, // 24x average
    hour: 3, // 3:00 AM (Odd hour)
    isNewPayee: true,
    isNewDevice: true,
    isUnusualLocation: true,
    notes: 'Urgent lottery tax processing',
  },
};
